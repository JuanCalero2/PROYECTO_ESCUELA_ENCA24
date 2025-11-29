import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Materias.css';

const Materias = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [profesorId, setProfesorId] = useState('');
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

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
        setMaterias(data || []);
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
      let response;
      if (editingId) {
        response = await fetch(`/estudios/estudios_update/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, descripcion, profesor_id: profesorId }),
        });
      } else {
        response = await fetch('/estudios/estudios_create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, descripcion, profesor_id: profesorId }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (editingId) {
          setMaterias(prev => prev.map(m => m.id === editingId ? data : m));
        } else {
          setMaterias(prev => [...prev, data]);
        }
        setNombre('');
        setDescripcion('');
        setProfesorId('');
        setEditingId(null);
      } else {
        setError('Error al guardar materia');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
  // use window.confirm to satisfy linters that restrict direct use of global confirm
  if (!window.confirm('¿Eliminar esta materia?')) return;
    try {
      const res = await fetch(`/estudios/estudios_delete/${id}`, { method: 'DELETE' });
      if (res.ok) setMaterias(prev => prev.filter(m => m.id !== id));
      else alert('No se pudo eliminar');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const getProfesorNombre = (profesor_id) => {
    const p = profesores.find(x => x.id === profesor_id);
    return p ? `${p.nombre} ${p.apellido || ''}` : profesor_id;
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
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Profesor:</label>
            <select value={profesorId} onChange={e => setProfesorId(e.target.value)} required>
              <option value="">Selecciona un profesor</option>
              {profesores.map(prof => (
                <option key={prof.id} value={prof.id}>{prof.nombre} {prof.apellido}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{display: 'flex', gap: 12, alignItems: 'center', marginTop: 12}}>
          <button type="submit" className="manager-btn">{editingId ? 'Guardar cambios' : 'Agregar Materia'}</button>
          {editingId && <button type="button" className="manager-btn ghost" onClick={() => { setEditingId(null); setNombre(''); setDescripcion(''); setProfesorId(''); }}>Cancelar</button>}
          <input className="manager-search" placeholder="Buscar materia..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="manager-list">
        <h3>Materias registradas</h3>
        {loading ? (
          <div>Cargando materias...</div>
        ) : (
          <div className="materias-grid">
            {materias.filter(m => (m.nombre || '').toLowerCase().includes(search.toLowerCase())).map(materia => (
              <article key={materia.id} className="materia-card">
                <div className="materia-card-head">
                  <h4>{materia.nombre}</h4>
                  <div className="materia-actions">
                    <button className="small" onClick={() => {
                      setEditingId(materia.id);
                      setNombre(materia.nombre || '');
                      setDescripcion(materia.descripcion || '');
                      setProfesorId(materia.profesor_id || '');
                    }}>Editar</button>
                    <button className="small danger" onClick={() => handleDelete(materia.id)}>Eliminar</button>
                  </div>
                </div>
                <p className="materia-desc">{materia.descripcion || '—'}</p>
                <div className="materia-footer">Profesor: <strong>{getProfesorNombre(materia.profesor_id)}</strong></div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materias;
