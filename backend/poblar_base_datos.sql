-- =====================================================
-- SCRIPT PARA POBLAR LA BASE DE DATOS COMPLETA
-- =====================================================

-- BORRAR TODA LA INFORMACIÓN DE LA BASE DE DATOS
TRUNCATE TABLE asignacion, estudios, estudiantes, profesores, usuarios, roles RESTART IDENTITY CASCADE;

-- =====================================================
-- 1. ROLES
-- =====================================================
INSERT INTO roles (nombre) VALUES 
('Profesor'), 
('Estudiante'), 
('Admin');

-- =====================================================
-- 2. USUARIOS (con contraseñas hasheadas para '123456')
-- =====================================================
INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol_id) VALUES
-- Admin (puede ver todo)
('Admin', 'Sistema', 'admin@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 3),

-- Profesores (pueden ver sus estudiantes y materias)
('María', 'González', 'maria.gonzalez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 1),
('Carlos', 'Rodríguez', 'carlos.rodriguez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 1),
('Ana', 'López', 'ana.lopez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 1),
('Luis', 'Martínez', 'luis.martinez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 1),
('Sofia', 'Hernández', 'sofia.hernandez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 1),

-- Estudiantes (pueden ver solo su información y materias asignadas)
('Juan', 'Pérez', 'juan.perez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('María', 'García', 'maria.garcia@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Pedro', 'Sánchez', 'pedro.sanchez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Carmen', 'Fernández', 'carmen.fernandez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Roberto', 'Jiménez', 'roberto.jimenez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Laura', 'Moreno', 'laura.moreno@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Diego', 'Ruiz', 'diego.ruiz@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Isabel', 'Díaz', 'isabel.diaz@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Miguel', 'Torres', 'miguel.torres@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2),
('Elena', 'Vázquez', 'elena.vazquez@escuela.com', '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW', 2);

-- =====================================================
-- 3. PROFESORES
-- =====================================================
INSERT INTO profesores (nombre, apellido, correo, especialidad, usuario_id) VALUES
('María', 'González', 'maria.gonzalez@escuela.com', 'Matemáticas', (SELECT id FROM usuarios WHERE correo='maria.gonzalez@escuela.com')),
('Carlos', 'Rodríguez', 'carlos.rodriguez@escuela.com', 'Física', (SELECT id FROM usuarios WHERE correo='carlos.rodriguez@escuela.com')),
('Ana', 'López', 'ana.lopez@escuela.com', 'Química', (SELECT id FROM usuarios WHERE correo='ana.lopez@escuela.com')),
('Luis', 'Martínez', 'luis.martinez@escuela.com', 'Historia', (SELECT id FROM usuarios WHERE correo='luis.martinez@escuela.com')),
('Sofia', 'Hernández', 'sofia.hernandez@escuela.com', 'Literatura', (SELECT id FROM usuarios WHERE correo='sofia.hernandez@escuela.com'));

-- =====================================================
-- 4. ESTUDIANTES
-- =====================================================
INSERT INTO estudiantes (nombre, apellido, correo, edad, direccion, usuario_id) VALUES
('Juan', 'Pérez', 'juan.perez@escuela.com', 18, 'Calle Principal 123, Ciudad', (SELECT id FROM usuarios WHERE correo='juan.perez@escuela.com')),
('María', 'García', 'maria.garcia@escuela.com', 17, 'Avenida Central 456, Ciudad', (SELECT id FROM usuarios WHERE correo='maria.garcia@escuela.com')),
('Pedro', 'Sánchez', 'pedro.sanchez@escuela.com', 19, 'Plaza Mayor 789, Ciudad', (SELECT id FROM usuarios WHERE correo='pedro.sanchez@escuela.com')),
('Carmen', 'Fernández', 'carmen.fernandez@escuela.com', 18, 'Calle Secundaria 321, Ciudad', (SELECT id FROM usuarios WHERE correo='carmen.fernandez@escuela.com')),
('Roberto', 'Jiménez', 'roberto.jimenez@escuela.com', 17, 'Boulevard Norte 654, Ciudad', (SELECT id FROM usuarios WHERE correo='roberto.jimenez@escuela.com')),
('Laura', 'Moreno', 'laura.moreno@escuela.com', 19, 'Calle Este 987, Ciudad', (SELECT id FROM usuarios WHERE correo='laura.moreno@escuela.com')),
('Diego', 'Ruiz', 'diego.ruiz@escuela.com', 18, 'Avenida Sur 147, Ciudad', (SELECT id FROM usuarios WHERE correo='diego.ruiz@escuela.com')),
('Isabel', 'Díaz', 'isabel.diaz@escuela.com', 17, 'Plaza Oeste 258, Ciudad', (SELECT id FROM usuarios WHERE correo='isabel.diaz@escuela.com')),
('Miguel', 'Torres', 'miguel.torres@escuela.com', 19, 'Calle Norte 369, Ciudad', (SELECT id FROM usuarios WHERE correo='miguel.torres@escuela.com')),
('Elena', 'Vázquez', 'elena.vazquez@escuela.com', 18, 'Avenida Este 741, Ciudad', (SELECT id FROM usuarios WHERE correo='elena.vazquez@escuela.com'));

-- =====================================================
-- 5. MATERIAS/ESTUDIOS
-- =====================================================
INSERT INTO estudios (nombre, descripcion, profesor_id) VALUES
('Matemáticas Avanzadas', 'Álgebra, cálculo y geometría avanzada', 1),
('Física Clásica', 'Mecánica, termodinámica y electromagnetismo', 2),
('Química Orgánica', 'Compuestos orgánicos y reacciones químicas', 3),
('Historia Universal', 'Historia mundial desde la antigüedad hasta la actualidad', 4),
('Literatura Española', 'Análisis de obras literarias españolas', 5),
('Matemáticas Básicas', 'Fundamentos de matemáticas para principiantes', 1),
('Física Moderna', 'Relatividad y física cuántica', 2),
('Química Inorgánica', 'Elementos y compuestos inorgánicos', 3),
('Historia de América', 'Historia del continente americano', 4),
('Literatura Latinoamericana', 'Obras literarias de autores latinoamericanos', 5);

-- =====================================================
-- 6. ASIGNACIONES (Estudiantes con materias)
-- =====================================================
INSERT INTO asignacion (estudiante_id, estudio_id, fecha_inscripcion) VALUES
-- Juan Pérez (estudiante 1) - Matemáticas y Física
(1, 1, CURRENT_DATE),  -- Matemáticas Avanzadas
(1, 2, CURRENT_DATE),  -- Física Clásica

-- María García (estudiante 2) - Química y Literatura
(2, 3, CURRENT_DATE),  -- Química Orgánica
(2, 5, CURRENT_DATE),  -- Literatura Española

-- Pedro Sánchez (estudiante 3) - Historia y Matemáticas
(3, 4, CURRENT_DATE),  -- Historia Universal
(3, 6, CURRENT_DATE),  -- Matemáticas Básicas

-- Carmen Fernández (estudiante 4) - Física y Literatura
(4, 2, CURRENT_DATE),  -- Física Clásica
(4, 10, CURRENT_DATE), -- Literatura Latinoamericana

-- Roberto Jiménez (estudiante 5) - Química e Historia
(5, 3, CURRENT_DATE),  -- Química Orgánica
(5, 9, CURRENT_DATE),  -- Historia de América

-- Laura Moreno (estudiante 6) - Matemáticas y Literatura
(6, 1, CURRENT_DATE),  -- Matemáticas Avanzadas
(6, 5, CURRENT_DATE),  -- Literatura Española

-- Diego Ruiz (estudiante 7) - Física y Química
(7, 7, CURRENT_DATE),  -- Física Moderna
(7, 8, CURRENT_DATE),  -- Química Inorgánica

-- Isabel Díaz (estudiante 8) - Historia y Matemáticas
(8, 4, CURRENT_DATE),  -- Historia Universal
(8, 6, CURRENT_DATE),  -- Matemáticas Básicas

-- Miguel Torres (estudiante 9) - Literatura y Física
(9, 10, CURRENT_DATE), -- Literatura Latinoamericana
(9, 2, CURRENT_DATE),  -- Física Clásica

-- Elena Vázquez (estudiante 10) - Química y Historia
(10, 3, CURRENT_DATE), -- Química Orgánica
(10, 9, CURRENT_DATE); -- Historia de América

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================
SELECT 'Roles creados:' as info;
SELECT * FROM roles;

SELECT 'Usuarios creados:' as info;
SELECT id, nombre, apellido, correo, rol_id FROM usuarios;

SELECT 'Profesores creados:' as info;
SELECT p.id, p.nombre, p.apellido, p.especialidad, u.correo 
FROM profesores p 
JOIN usuarios u ON p.usuario_id = u.id;

SELECT 'Estudiantes creados:' as info;
SELECT e.id, e.nombre, e.apellido, e.edad, e.direccion, u.correo 
FROM estudiantes e 
JOIN usuarios u ON e.usuario_id = u.id;

SELECT 'Materias creadas:' as info;
SELECT es.id, es.nombre, es.descripcion, p.nombre || ' ' || p.apellido as profesor
FROM estudios es
JOIN profesores p ON es.profesor_id = p.id;

SELECT 'Asignaciones creadas:' as info;
SELECT a.id, e.nombre || ' ' || e.apellido as estudiante, es.nombre as materia, a.fecha_inscripcion
FROM asignacion a
JOIN estudiantes e ON a.estudiante_id = e.id
JOIN estudios es ON a.estudio_id = es.id
ORDER BY e.nombre, es.nombre;
