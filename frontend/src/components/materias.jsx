import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Materias.css'; // Importar el nuevo archivo CSS exclusivo para el componente Materias


const Materias = () => {
  // Estado para el formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [profesorId, setProfesorId] = useState('');
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/profesores/profesores/list')
      .then(res => res.json())
      .then(data => setProfesores(data))
      .catch(err => setError('Error al cargar profesores'));
  }, []);

  useEffect(() => {
    fetch('/estudios/estudios_get')
      .then(res => res.json())
      .then(data => {
        setMaterias(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar materias');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('estudios/estudios_create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, descripcion, profesor_id: profesorId }),
      });
      if (response.ok) {
        const nuevaMateria = await response.json();
        setMaterias([...materias, nuevaMateria]);
        setNombre('');
        setDescripcion('');
        setProfesorId('');
      } else {
        setError('Error al agregar materia');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <Link to="/dashboard" className="back-btn">← Volver al Dashboard</Link>
        <h2>Gestión de Materias</h2>
      </div>
      <form className="manager-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre de la materia:</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Profesor:</label>
            <select
              value={profesorId}
              onChange={e => setProfesorId(e.target.value)}
              required
            >
              <option value="">Selecciona un profesor</option>
              {profesores.map(prof => (
                <option key={prof.id} value={prof.id}>
                  {prof.nombre} {prof.apellido}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="manager-btn">Agregar Materia</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="manager-list">
        <h3>Materias registradas</h3>
        {loading ? (
          <div>Cargando materias...</div>
        ) : (
          <ul>
            {materias.map(materia => (
              <li key={materia.id} className="manager-card">
                <strong>{materia.nombre}</strong>: {materia.descripcion} <br />
                <strong>Profesor:</strong> {profesores.find(p => p.id === materia.profesor_id)
                            ? profesores.find(p => p.id === materia.profesor_id).nombre + ' ' + profesores.find(p => p.id === materia.profesor_id).apellido
                            : materia.profesor_id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Materias;
