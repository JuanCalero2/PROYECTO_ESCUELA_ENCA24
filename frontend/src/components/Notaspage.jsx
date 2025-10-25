import React, { useEffect, useState } from "react";
import "../styles/NotasPage.css";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config";

function NotasPage({ user }) {
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [profesorId, setProfesorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notaEditando, setNotaEditando] = useState(null);
  const [nuevaNota, setNuevaNota] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [nuevaNotaData, setNuevaNotaData] = useState({
    estudiante_id: "",
    asignacion_id: "",
    nota: "",
    descripcion: ""
  });

  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
      try {
        const authHeaders = getAuthHeaders();
        // Cargar notas (según rol) y luego estudiantes/asignaciones por separado
        const notasUrl =
          user?.rol === "estudiante"
            ? buildApiUrl(`${API_CONFIG.NOTAS.GET_POR_ESTUDIANTE}${user.id}`)
            : buildApiUrl(API_CONFIG.NOTAS.GET_ALL);

        // Pedir notas
        let notasData = [];
        try {
          const notasRes = await fetch(notasUrl, { headers: authHeaders });
          if (notasRes.ok) {
            const nd = await notasRes.json();
            notasData = Array.isArray(nd) ? nd : nd.notas || [];
          } else {
            console.error("Error al obtener notas:", notasRes.status, notasRes.statusText);
          }
        } catch (e) {
          console.error("Excepción al obtener notas:", e);
        }


        // Pedir estudiantes
        let estudiantesData = [];
        try {
          const estudiantesRes = await fetch(buildApiUrl(API_CONFIG.ESTUDIANTES.GET_ALL), {
            headers: authHeaders,
          });
          if (estudiantesRes.ok) estudiantesData = await estudiantesRes.json();
          else console.error("Error al obtener estudiantes:", estudiantesRes.status);
        } catch (e) {
          console.error("Excepción al obtener estudiantes:", e);
        }

        // Intentar obtener el profesor del endpoint /profesores/me (más fiable)
        let profesoresData = [];
        try {
          const meRes = await fetch(buildApiUrl(API_CONFIG.PROFESORES.ME), { headers: authHeaders });
          if (meRes.ok) {
            const myProf = await meRes.json();
            setProfesorId(myProf.id);
          } else {
            // Si no existe endpoint /me o devuelve 404, caemos al listado completo
            const profesoresRes = await fetch(buildApiUrl(API_CONFIG.PROFESORES.GET_ALL), {
              headers: authHeaders,
            });
            if (profesoresRes.ok) profesoresData = await profesoresRes.json();
            else console.error("Error al obtener profesores:", profesoresRes.status);
          }
        } catch (e) {
          console.error("Excepción al obtener profesores:", e);
        }

        setProfesores(Array.isArray(profesoresData) ? profesoresData : []);

        // DEBUG: loguear la estructura para depuración
        console.debug('profesoresData:', profesoresData);
        console.debug('usuario autenticado:', user);

        // Buscar el profesor correspondiente al usuario autenticado
        if (user?.rol === 'profesor' && Array.isArray(profesoresData)) {
          // Soportar distintos nombres de campo y tipos (intentar por id si está disponible)
          let prof = null;
          if (user.id !== undefined && user.id !== null) {
            prof = profesoresData.find(p => {
              const candidateIds = [p.usuario_id, p.user_id, p.usuarioId, p.userId, p.usuario_id];
              return candidateIds.some(cid => cid !== undefined && String(cid) === String(user.id));
            });
            if (!prof) {
              console.warn('No se encontró profesor para usuario (por id):', user.id);
            }
          } else {
            // user.id undefined: lo logueamos y esperaremos usar el correo como fallback
            console.debug('user.id indefinido; se intentará emparejar por correo más abajo si es necesario');
          }

          // Si no encontramos por id, intentamos por correo (campo común en la tabla profesores)
          if (!prof && user && (user.email || user.correo)) {
            const userEmail = (user.email || user.correo).toString().toLowerCase();
            prof = profesoresData.find(p => p.correo && p.correo.toString().toLowerCase() === userEmail);
            if (!prof) {
              console.warn('No se encontró profesor para usuario (por correo):', userEmail);
              console.debug('Listado de profesores (para inspección):', profesoresData.map(p => ({id: p.id, correo: p.correo})).slice(0,20));
            }
          }

          setProfesorId(prof ? prof.id : null);
        }

        // Pedir asignaciones según rol del usuario para evitar 403 en endpoints de admin
        let asignacionesData = [];
        try {
          let asignUrl;
          if (user?.rol === 'estudiante') {
            // Endpoint que devuelve { estudiante, asignaciones: [...] }
            asignUrl = buildApiUrl(API_CONFIG.ASIGNACIONES.GET_POR_ESTUDIANTE);
          } else if (user?.rol === 'profesor') {
            // Endpoint que devuelve { profesor, materias: [...] }
            asignUrl = buildApiUrl(API_CONFIG.ASIGNACIONES.GET_POR_PROFESOR);
          } else if (user?.rol === 'administrador' || user?.rol === 'admin') {
            asignUrl = buildApiUrl(API_CONFIG.ASIGNACIONES.GET_ALL);
          } else {
            // Fallback: intentar el endpoint admin (si el backend lo requiere será 403)
            asignUrl = buildApiUrl(API_CONFIG.ASIGNACIONES.GET_ALL);
          }

          const asignRes = await fetch(asignUrl, { headers: authHeaders });
          if (asignRes.ok) {
            asignacionesData = await asignRes.json();
            // Si es profesor y devuelve { materias: [...] } normalizar
            if (asignacionesData && asignacionesData.materias) {
              asignacionesData = asignacionesData.materias;
            }
            // Si es estudiante y devuelve { asignaciones: [...] } normalizar
            if (asignacionesData && asignacionesData.asignaciones) {
              asignacionesData = asignacionesData.asignaciones;
            }
          } else {
            console.error("Error al obtener asignaciones:", asignRes.status, asignRes.statusText);
          }
        } catch (e) {
          console.error("Excepción al obtener asignaciones:", e);
        }

        console.log("Estudiantes:", estudiantesData);
        console.log("Asignaciones:", asignacionesData);

  setNotas(notasData || []);
  setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : estudiantesData.estudiantes || []);

        // Normalizar asignaciones: backend puede devolver lista de objetos con "materia" o con campos directos
        const normalizedAsign = (Array.isArray(asignacionesData) ? asignacionesData : asignacionesData.asignaciones || []).map((a) => {
          // casos posibles: a.materia.nombre (cuando endpoint de estudiante/profesor), o a.materia.nombre + id
          if (a.materia && typeof a.materia === 'object') {
            return { id: a.id, nombre: a.materia.nombre || a.materia.nombre, raw: a };
          }
          // admin/all devuelve {id, materia: {nombre}} o puede devolver nombre directo
          if (a.nombre) return { id: a.id, nombre: a.nombre, raw: a };
          if (a.materia_nombre) return { id: a.id, nombre: a.materia_nombre, raw: a };
          return { id: a.id, nombre: `Asignación ${a.id}`, raw: a };
        });

        setAsignaciones(normalizedAsign || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
        // No sobreescribir datos si hay fallo general, ya que se mantienen en estado previo
        // Dejar estados vacíos solo si estaban indefinidos
        setNotas((s) => s || []);
        setEstudiantes((s) => s || []);
        setAsignaciones((s) => s || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const guardarNota = async () => {
    if (!notaEditando) return;
    const authHeaders = getAuthHeaders();
    try {
      setSubmitting(true);
      const payload = {
        asignacion_id: notaEditando.asignacion_id || notaEditando.asignacionId || notaEditando.asignacion_id,
        nota: Number(nuevaNota),
        fecha: new Date().toISOString().split('T')[0],
        descripcion: notaEditando.descripcion || ''
      };

      const res = await fetch(buildApiUrl(`${API_CONFIG.NOTAS.UPDATE}${notaEditando.id}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'error', text: `Error al actualizar la nota: ${err.detail || res.status}` });
        setSubmitting(false);
        return;
      }

      const updated = await res.json();
      setNotas((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setNotaEditando(null);
      setNuevaNota('');
      setMessage({ type: 'success', text: 'Nota actualizada correctamente.' });
    } catch (e) {
      console.error('Error guardando nota:', e);
      setMessage({ type: 'error', text: 'Error guardando la nota.' });
    } finally {
      setSubmitting(false);
    }
  };

  const eliminarNota = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta nota?')) return;

    const authHeaders = getAuthHeaders();
    setSubmitting(true);
    try {
      const url = buildApiUrl(`${API_CONFIG.NOTAS.DELETE}${id}`);
      const res = await fetch(url, {
        method: 'DELETE',
        headers: authHeaders,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'error', text: `Error al eliminar la nota: ${err.detail || res.status}` });
        return;
      }

      setNotas((prev) => prev.filter((n) => n.id !== id));
      setMessage({ type: 'success', text: 'Nota eliminada correctamente.' });
    } catch (e) {
      console.error('Error eliminando nota:', e);
      setMessage({ type: 'error', text: 'Error al eliminar la nota.' });
    } finally {
      setSubmitting(false);
    }
  };

  const crearNota = async () => {
    // Validaciones básicas
    if (!nuevaNotaData.estudiante_id) return setMessage({ type: 'error', text: 'Seleccione un estudiante.' });
    if (!nuevaNotaData.asignacion_id) return setMessage({ type: 'error', text: 'Seleccione una asignación.' });
    if (!nuevaNotaData.nota && nuevaNotaData.nota !== 0) return setMessage({ type: 'error', text: 'Ingrese una nota.' });

    const authHeaders = getAuthHeaders();
    setSubmitting(true);
    try {
      // Usar el id de profesor correcto
      let idProfesor = profesorId;
      // Si es admin, permitir seleccionar (opcional, aquí solo para profesor)
      if (user?.rol === 'profesor' && !idProfesor) {
        // fallback: buscar en profesores
        const prof = profesores.find(p => p.usuario_id === user.id);
        idProfesor = prof ? prof.id : null;
      }
      if (!idProfesor) {
        // Continuar sin profesor asignado y mostrar mensaje informativo
        setMessage({ type: 'info', text: 'Se creará la nota sin asignar un profesor (no se encontró perfil de profesor para el usuario).' });
      }
      console.log('Creando nota con:', nuevaNotaData);
      const payload = {
        estudiante_id: Number(nuevaNotaData.estudiante_id),
        estudio_id: Number(nuevaNotaData.asignacion_id), // usamos asignacion_id del frontend como estudio_id
        nota: Number(nuevaNotaData.nota),
        fecha: new Date().toISOString().split('T')[0],
        descripcion: nuevaNotaData.descripcion || '',
        profesor_id: idProfesor // ID del profesor que crea la nota
      };

      const url = buildApiUrl(API_CONFIG.NOTAS.CREATE);
      console.log('Enviando POST a:', url);
      console.log('Payload:', payload);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'error', text: `Error creando la nota: ${err.detail || res.status}` });
        return;
      }

      const created = await res.json();
      // Añadir la nota a la lista
      setNotas((prev) => [created, ...prev]);
      setIsCreating(false);
      setNuevaNotaData({ estudiante_id: '', asignacion_id: '', nota: '' });
      setMessage({ type: 'success', text: 'Nota creada correctamente.' });
    } catch (e) {
      console.error('Error creando nota:', e);
      setMessage({ type: 'error', text: 'Error creando la nota.' });
    }
  };

  if (loading) return <p className="loading">Cargando datos...</p>;

  return (
    <div className="notas-page-container">
      <h2 className="notas-title">Notas de Estudiantes</h2>
      {user?.rol === "profesor" && (
        <button onClick={() => setIsCreating(true)} className="create-note-btn">
          Crear Nueva Nota
        </button>
      )}
      <table className="notas-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Asignación</th>
            <th>Nota</th>
            <th>Descripción</th>
            <th>Profesor</th>
            {(user?.rol === "profesor" || user?.rol === "administrador") && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>{nota.estudiante_nombre} {nota.estudiante_apellido}</td>
              <td>{nota.materia_nombre}</td>
              <td>{nota.nota}</td>
              <td>{nota.descripcion || ''}</td>
              <td>
                {nota.profesor_nombre
                  ? `${nota.profesor_nombre} ${nota.profesor_apellido}`
                  : (user?.rol === 'profesor'
                      ? `${user.nombre || user.correo || ''} ${user.apellido || ''}`.trim()
                      : 'Sin profesor')
                }
              </td>
              {(user?.rol === "profesor" || user?.rol === "administrador") && (
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setNotaEditando(nota);
                      setNuevaNota(nota.nota);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => eliminarNota(nota.id)}
                    disabled={submitting}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {(notaEditando || isCreating) && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{isCreating ? "Crear Nueva Nota" : "Editar Nota"}</h3>
            {isCreating ? (
              <>
                <select
                  value={nuevaNotaData.estudiante_id}
                  onChange={(e) =>
                    setNuevaNotaData({
                      ...nuevaNotaData,
                      estudiante_id: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={nuevaNotaData.asignacion_id}
                  onChange={(e) =>
                    setNuevaNotaData({
                      ...nuevaNotaData,
                      asignacion_id: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccione una asignación</option>
                  {asignaciones.map((asig) => (
                    <option key={asig.id} value={asig.id}>
                      {asig.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Nota"
                  value={nuevaNotaData.nota}
                  onChange={(e) =>
                    setNuevaNotaData({ ...nuevaNotaData, nota: e.target.value })
                  }
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={nuevaNotaData.descripcion}
                  onChange={(e) =>
                    setNuevaNotaData({ ...nuevaNotaData, descripcion: e.target.value })
                  }
                  rows={3}
                  style={{ width: '100%', marginTop: '8px', marginBottom: '8px', resize: 'vertical' }}
                />
              </>
            ) : (
              <input
                type="number"
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
              />
            )}
            <div className="modal-actions">
              <button
                onClick={() => {
                  setNotaEditando(null);
                  setIsCreating(false);
                }}
                className="cancel-btn"
              >
                Cancelar
              </button>
              <button
                onClick={isCreating ? crearNota : guardarNota}
                className="save-btn"
                disabled={submitting}
              >
                {submitting ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear' : 'Guardar')}
              </button>
            </div>
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotasPage;