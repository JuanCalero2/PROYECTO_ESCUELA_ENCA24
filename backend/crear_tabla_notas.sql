-- Crear tabla notas
CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    estudiante_id INT NOT NULL,
    estudio_id INT NOT NULL,
    nota DECIMAL(4,2) NOT NULL,  -- Permite notas con 2 decimales
    fecha DATE NOT NULL,
    descripcion TEXT,
    profesor_id INT,
    CONSTRAINT fk_estudiante_nota
        FOREIGN KEY (estudiante_id) 
        REFERENCES estudiantes (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_estudio_nota
        FOREIGN KEY (estudio_id) 
        REFERENCES estudios (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_profesor_nota
        FOREIGN KEY (profesor_id) 
        REFERENCES profesores (id)
        ON DELETE SET NULL
);