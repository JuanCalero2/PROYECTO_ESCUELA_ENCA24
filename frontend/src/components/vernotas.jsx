
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './vernotas.css';

const VerNotas = () => {
    const [notas, setNotas] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const [estudianteId, setEstudianteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener el estudiante asociado al usuario
    useEffect(() => {
        if (!userInfo?.id) {
            setLoading(false);
            return;
        }

        fetch(`/estudiantes/estudiante_by_userid/${userInfo.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener estudiante');
                return res.json();
            })
            .then(data => {
                setEstudianteId(data.id);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudo obtener el estudiante.');
            });
    }, [userInfo.id]);

    // Cargar notas cuando tengamos el estudiante
    useEffect(() => {
        if (!estudianteId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`/estudiantes/notas_estudiante/${estudianteId}`)
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener las notas');
                return res.json();
            })
            .then(data => setNotas(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setError('Error al cargar las notas.');
            })
            .finally(() => setLoading(false));
    }, [estudianteId]);

    const promedio = (n1, n2, n3) => {
        const nums = [n1, n2, n3]
            .map(x => parseFloat(x))
            .filter(x => !Number.isNaN(x));
        if (nums.length === 0) return '—';
        const sum = nums.reduce((s, v) => s + v, 0);
        return (sum / nums.length).toFixed(2);
    };

    return (
        <div className="vn-container">
            <div className="vn-header">
                <Link to="/dashboard" className="vn-back">← Volver</Link>
                <h1 className="vn-title">Calificaciones</h1>
            </div>

            <div className="vn-subheader">
                <div>Estudiante ID: <strong>{estudianteId ?? '—'}</strong></div>
                <div className="vn-actions">
                    {/* espacio para futuras acciones */}
                </div>
            </div>

            {loading ? (
                <div className="vn-loading">Cargando calificaciones…</div>
            ) : error ? (
                <div className="vn-error">{error}</div>
            ) : notas.length === 0 ? (
                <div className="vn-empty">No hay calificaciones registradas para este estudiante.</div>
            ) : (
                <div className="vn-grid">
                    {notas.map(nota => (
                        <article className="vn-card" key={nota.id}>
                            <header className="vn-card-header">
                                <h3 className="vn-materia">{nota.nombre || 'Materia'}</h3>
                                <div className="vn-promedio">Promedio
                                    <span className="vn-badge">{promedio(nota.nota1, nota.nota2, nota.nota3)}</span>
                                </div>
                            </header>

                            <div className="vn-card-body">
                                <div className="vn-row"><span className="vn-label">Nota 1</span><span>{nota.nota1 ?? '—'}</span></div>
                                <div className="vn-row"><span className="vn-label">Nota 2</span><span>{nota.nota2 ?? '—'}</span></div>
                                <div className="vn-row"><span className="vn-label">Nota 3</span><span>{nota.nota3 ?? '—'}</span></div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerNotas;
