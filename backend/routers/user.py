from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from datetime import timedelta
from jose import jwt, JWTError
from db import get_db_connection
from security.tokens import create_access_token
from security.auth import get_current_user, verificar_rol
from passlib.context import CryptContext  # Importar CryptContext para la verificación de contraseñas
from models.user import User, UserUpdate, UserProfile

router = APIRouter()

# Configuración para JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = "tu_clave_secreta"  # Cambia esto por tu clave real
ALGORITHM = "HS256"
security = HTTPBearer()

# Contexto de encriptación para verificar contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Verificación de contraseña hasheada
def verificar_contrasena(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Ruta para iniciar sesión
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Verificar si el correo existe
        cur.execute('SELECT * FROM usuarios WHERE correo = %s', (form_data.username,))
        user = cur.fetchone()
        
        if user is None or not verificar_contrasena(form_data.password, user['contrasena']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Crear token JWT
        token_data = {
            "sub": user['correo'],
            "rol_id": user['rol_id']
        }
        access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al iniciar sesión: {e}")
    finally:
        # Cerrar el cursor y la conexión si fueron creados
        cur.close()
        conn.close()

# Ruta para obtener información del usuario actual
@router.get("/me", dependencies=[Depends(get_current_user)])
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Endpoint para obtener perfil del usuario actual
@router.get("/profile", dependencies=[Depends(get_current_user)])
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "nombre": current_user["nombre"],
        "apellido": current_user["apellido"],
        "correo": current_user["correo"],
        "rol_id": current_user["rol_id"],
        "rol_nombre": current_user["rol_nombre"]
    }

# Endpoint para obtener perfil de usuario por id
@router.get("/usuarios/perfil/{id}", response_model=User)
def get_user_profile(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, apellido, correo FROM usuarios WHERE id = %s", (id,))
    user_data = cur.fetchone()
    cur.close()
    conn.close()
    if not user_data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return User(id=user_data['id'], nombre=user_data['nombre'], apellido=user_data['apellido'], correo=user_data['correo'])

# Endpoint para actualizar perfil de usuario
@router.put("/usuarios/perfil/{id}", response_model=User)
def update_user_profile(id: int, user_update: UserUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE usuarios SET nombre = %s, apellido = %s, correo = %s WHERE id = %s RETURNING id, nombre, apellido, correo",
        (user_update.nombre, user_update.apellido, user_update.correo, id)
    )
    updated_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not updated_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return User(id=updated_user['id'], nombre=updated_user['nombre'], apellido=updated_user['apellido'], correo=updated_user['correo'])

# Ruta solo accesible para administradores (rol_id = 1)
@router.get("/usuarios/admin", dependencies=[Depends(verificar_rol(1))])
def read_admin_data(current_user: dict = Depends(get_current_user)):
    return {"message": "Datos de administrador", "usuario": current_user}

# Ruta solo accesible para profesores (rol_id = 2)
@router.get("/usuarios/profesor", dependencies=[Depends(verificar_rol(2))])
def read_profesor_data(current_user: dict = Depends(get_current_user)):
    return {"message": "Datos de profesor", "usuario": current_user}

# Ruta solo accesible para estudiantes (rol_id = 3)
@router.get("/usuarios/estudiante", dependencies=[Depends(verificar_rol(3))])
def read_estudiante_data(current_user: dict = Depends(get_current_user)):
    return {"message": "Datos de estudiante", "usuario": current_user}

# Endpoint para obtener el perfil del usuario autenticado usando JWT
@router.get("/perfil/", response_model=UserProfile)
def get_user_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                u.id, u.nombre, u.apellido, u.correo, u.rol_id, r.nombre AS rol,
                e.edad, e.direccion, e.id AS estudiante_id,
                p.especialidad, p.id AS profesor_id
            FROM usuarios u
            LEFT JOIN roles r ON u.rol_id = r.id
            LEFT JOIN estudiantes e ON u.id = e.usuario_id
            LEFT JOIN profesores p ON u.id = p.usuario_id
            WHERE u.id = %s
        """, (user_id,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return UserProfile(
            id=user[0],
            nombre=user[1],
            apellido=user[2],
            correo=user[3],
            rol_id=user[4],
            rol=user[5],
            edad=user[6],
            direccion=user[7],
            estudiante_id=user[8],
            especialidad=user[9],
            profesor_id=user[10]
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
