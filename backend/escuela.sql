-- BORRAR TODA LA INFORMACIÓN DE LA BASE DE DATOS
TRUNCATE TABLE asignacion, estudios, estudiantes, profesores, usuarios, roles RESTART IDENTITY CASCADE;

-- ROLES
INSERT INTO roles (nombre) VALUES ('Profesor'), ('Estudiante'), ('Admin');

-- USUARIOS
INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id) VALUES
('Admin', 'User', 'admin@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 3), -- Admin (rol_id=3)
('Profe1', 'Apellido1', 'profe1@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 1),
('Profe2', 'Apellido2', 'profe2@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 1),
('Profe3', 'Apellido3', 'profe3@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 1),
('Profe4', 'Apellido4', 'profe4@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 1),
('Profe5', 'Apellido5', 'profe5@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 1),
('Estu1', 'Apellido1', 'estu1@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2),
('Estu2', 'Apellido2', 'estu2@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2),
('Estu3', 'Apellido3', 'estu3@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2),
('Estu4', 'Apellido4', 'estu4@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2),
('Estu5', 'Apellido5', 'estu5@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2);

-- PROFESORES
INSERT INTO profesores (nombre, apellido, correo, especialidad, usuario_id) VALUES
('Profe1', 'Apellido1', 'profe1@escuela.com', 'Matemáticas', (SELECT id FROM usuarios WHERE correo='profe1@escuela.com')),
('Profe2', 'Apellido2', 'profe2@escuela.com', 'Física', (SELECT id FROM usuarios WHERE correo='profe2@escuela.com')),
('Profe3', 'Apellido3', 'profe3@escuela.com', 'Química', (SELECT id FROM usuarios WHERE correo='profe3@escuela.com')),
('Profe4', 'Apellido4', 'profe4@escuela.com', 'Historia', (SELECT id FROM usuarios WHERE correo='profe4@escuela.com')),
('Profe5', 'Apellido5', 'profe5@escuela.com', 'Geografía', (SELECT id FROM usuarios WHERE correo='profe5@escuela.com'));

-- ESTUDIANTES
INSERT INTO estudiantes (nombre, apellido, correo, edad, direccion, usuario_id) VALUES
('Estu1', 'Apellido1', 'estu1@escuela.com', 18, 'Calle 1', (SELECT id FROM usuarios WHERE correo='estu1@escuela.com')),
('Estu2', 'Apellido2', 'estu2@escuela.com', 19, 'Calle 2', (SELECT id FROM usuarios WHERE correo='estu2@escuela.com')),
('Estu3', 'Apellido3', 'estu3@escuela.com', 20, 'Calle 3', (SELECT id FROM usuarios WHERE correo='estu3@escuela.com')),
('Estu4', 'Apellido4', 'estu4@escuela.com', 21, 'Calle 4', (SELECT id FROM usuarios WHERE correo='estu4@escuela.com')),
('Estu5', 'Apellido5', 'estu5@escuela.com', 22, 'Calle 5', (SELECT id FROM usuarios WHERE correo='estu5@escuela.com'));

-- MATERIAS
INSERT INTO estudios (nombre, descripcion, profesor_id) VALUES
('Matemáticas', 'Materia de matemáticas', 1),
('Física', 'Materia de física', 2),
('Química', 'Materia de química', 3),
('Historia', 'Materia de historia', 4),
('Geografía', 'Materia de geografía', 5);

-- ASIGNACIONES (cada estudiante con una materia y profesor)
INSERT INTO asignacion (estudiante_id, estudio_id, fecha_inscripcion) VALUES
(1, 1, CURRENT_DATE),
(2, 2, CURRENT_DATE),
(3, 3, CURRENT_DATE),
(4, 4, CURRENT_DATE),
(5, 5, CURRENT_DATE);
-- Database: escuela

-- DROP DATABASE IF EXISTS escuela;


select * from profesores

CREATE DATABASE escuela
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
		-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL  -- 'Estudiante' o 'Profesor'
);

-- Tabla de usuarios (para login)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- contraseña encriptada
    rol_id INT NOT NULL, -- Rol del usuario (Profesor o Estudiante)
    CONSTRAINT fk_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles (id)
);

-- Tabla de profesores
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    usuario_id INT, -- Relación con usuarios
    CONSTRAINT fk_usuario_profesor
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
);

-- Tabla de estudiantes
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    edad INT,
    direccion VARCHAR(255),
    usuario_id INT, -- Relación con usuarios
    CONSTRAINT fk_usuario_estudiante
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
);

-- Tabla de materias
CREATE TABLE estudios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,  -- nombre de la materia
    descripcion TEXT,              -- descripción de la materia
    profesor_id INT,
    CONSTRAINT fk_profesor
        FOREIGN KEY (profesor_id) 
        REFERENCES profesores (id)
        ON DELETE SET NULL
);

-- Tabla de asignación de materias (muchos a muchos entre estudiantes y materias)
CREATE TABLE asignacion (
    id SERIAL PRIMARY KEY,
    estudiante_id INT,
    estudio_id INT,
    fecha_inscripcion DATE,
    CONSTRAINT fk_estudiante
        FOREIGN KEY (estudiante_id) 
        REFERENCES estudiantes (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_estudio
        FOREIGN KEY (estudio_id) 
        REFERENCES estudios (id)
        ON DELETE CASCADE
);

-- Insertar roles
INSERT INTO roles (nombre)
VALUES 
('Profesor'),
('Estudiante');

INSERT INTO usuarios (id_usuario, nombre_usuario, correo, contrasena, id_rol) VALUES
    (1, 'admin', 'admin@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 1),
    (2, 'profesor1', 'profesor1@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2),
    (3, 'profesor2', 'profesor2@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 2),
    (4, 'estudiante1', 'estudiante1@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 3),
    (5, 'estudiante2', 'estudiante2@escuela.com', '$2b$12$wQwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 3);

-- Insertar relación de usuario con profesor
UPDATE profesores 
SET usuario_id = (SELECT id FROM usuarios WHERE correo = 'juan.perez@escuela.com')
WHERE correo = 'juan.perez@escuela.com';

-- Insertar relación de usuario con estudiante
UPDATE estudiantes 
SET usuario_id = (SELECT id FROM usuarios WHERE correo = 'pedro.ramirez@escuela.com')
WHERE correo = 'pedro.ramirez@escuela.com';



-- Insertar datos en la tabla de profesores
INSERT INTO profesores (nombre, apellido, correo, especialidad)
VALUES 
('Juan', 'Pérez', 'juan.perez@escuela.com', 'Matemáticas');

-- Insertar datos en la tabla de estudiantes
INSERT INTO estudiantes (nombre, apellido, correo, edad, direccion)
VALUES 
('Pedro', 'Ramírez', 'pedro.ramirez@escuela.com', 20, 'Calle Falsa 123');

-- Actualizar relación de usuario con profesor
UPDATE profesores 
SET usuario_id = (SELECT id FROM usuarios WHERE correo = 'juan.perez@escuela.com')
WHERE correo = 'juan.perez@escuela.com';

-- Actualizar relación de usuario con estudiante
UPDATE estudiantes 
SET usuario_id = (SELECT id FROM usuarios WHERE correo = 'pedro.ramirez@escuela.com')
WHERE correo = 'pedro.ramirez@escuela.com';




INSERT INTO roles (nombre)
VALUES 
('admin')


-- Insertar usuarios
INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id)
VALUES 
('Juan', 'Pérez', 'juan.perez@escuela.com', 'hashed_password', 1),  -- Profesor
('Pedro', 'Ramírez', 'pedro.ramirez@escuela.com', 'hashed_password', 2); -- Estudiante

-- Insertar datos en la tabla de profesores
INSERT INTO profesores (nombre, apellido, correo, especialidad)
VALUES 
('Juan', 'Pérez', 'juan.perez@escuela.com', 'Matemáticas');

-- Insertar datos en la tabla de estudiantes
INSERT INTO estudiantes (nombre, apellido, correo, edad, direccion)
VALUES 
('Pedro', 'Ramírez', 'pedro.ramirez@escuela.com', 20, 'Calle Falsa 123');

-- Actualizar relación de usuario con profesor
UPDATE profesores 
SET usuario_id = (SELECT id FROM usuarios WHERE correo = 'juan.perez@escuela.com')
WHERE correo = 'juan.perez@escuela.com';

-- Actualizar relación de usuario con estudiante
UPDATE estudiantes 
SET usuario_id = (SELECT id FROM usuarios WHERE correo = 'pedro.ramirez@escuela.com')
WHERE correo = 'pedro.ramirez@escuela.com';


-- Insertar un nuevo rol para Administrador si no existe
INSERT INTO roles (nombre) 
VALUES ('Administrador')
ON CONFLICT (nombre) DO NOTHING;  -- Esto evitará duplicados

-- Insertar el usuario administrador con la contraseña hasheada
INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id)
VALUES 
('Admin', 'User', 'admin@escuela.com', '$2b$12$Xz6e5eK23NF93f2hnnyuf.U94x2TOlCaviiixE3H5VSicvCGiDwUq', (SELECT id FROM roles WHERE nombre = 'Administrador'));

INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id)
VALUES 
('andres', 'User', 'andres@escuela.com', '1', (SELECT id FROM roles WHERE nombre = 'Administrador'));
