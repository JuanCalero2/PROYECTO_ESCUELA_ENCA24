import bcrypt

def hash_password(password):
    """Genera un hash de la contraseña usando bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed):
    """Verifica si una contraseña coincide con su hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

if __name__ == "__main__":
    # Contraseña que quieres usar para todos los usuarios
    password = "123456"
    
    # Generar hash
    hashed_password = hash_password(password)
    
    print(f"Contraseña original: {password}")
    print(f"Contraseña hasheada: {hashed_password}")
    
    # Verificar que funciona
    is_valid = verify_password(password, hashed_password)
    print(f"Verificación: {is_valid}")
    
    print("\n" + "="*50)
    print("SQL para actualizar la base de datos:")
    print("="*50)
    
    # Generar SQL para actualizar todos los usuarios
    sql_template = """
-- Actualizar contraseñas de todos los usuarios a '123456'
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'admin@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'profe1@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'profe2@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'profe3@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'profe4@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'profe5@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'estu1@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'estu2@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'estu3@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'estu4@escuela.com';
UPDATE usuarios SET contrasena = '{}' WHERE correo = 'estu5@escuela.com';
""".format(hashed_password, hashed_password, hashed_password, hashed_password, 
           hashed_password, hashed_password, hashed_password, hashed_password, 
           hashed_password, hashed_password, hashed_password)
    
    print(sql_template)
    
    print("\n" + "="*50)
    print("Credenciales para probar:")
    print("="*50)
    print("Correo: admin@escuela.com")
    print("Contraseña: 123456")
    print("Correo: profe1@escuela.com")
    print("Contraseña: 123456")
    print("Correo: estu1@escuela.com")
    print("Contraseña: 123456")
