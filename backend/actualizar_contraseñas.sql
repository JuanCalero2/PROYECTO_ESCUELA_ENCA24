-- Actualizar contraseñas de todos los usuarios a '123456' (hasheada correctamente)
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'admin@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'profe1@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'profe2@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'profe3@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'profe4@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'profe5@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'estu1@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'estu2@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'estu3@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'estu4@escuela.com';
UPDATE usuarios SET contrasena = '$2b$12$fzmkSqoi0olzyOEuEIkZdOiUWWws5aMH5BjlPHj9pRojxCyGpQ.XW' WHERE correo = 'estu5@escuela.com';

-- Verificar que se actualizaron correctamente
SELECT correo, contrasena FROM usuarios;
