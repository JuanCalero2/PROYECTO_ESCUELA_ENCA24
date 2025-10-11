import React, { useEffect, useState } from "react";
import "../styles/NotasPage.css";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config";

function NotasPage({ user }) {
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notaEditando, setNotaEditando] = useState(null);
  const [nuevaNota, setNuevaNota] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [nuevaNotaData, setNuevaNotaData] = useState({
    estudiante_id: "",
    materia_id: "",
    nota: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authHeaders = getAuthHeaders();
        const [notasRes, estudiantesRes, materiasRes] = await Promise.all([
          fetch(
            user?.rol === "estudiante"
              ? `http://127.0.0.1:8000/notas_estudiante/${user.id}`
              : "http://127.0.0.1:8000/notas_get/",
            { headers: authHeaders }
          ),
          fetch(buildApiUrl(API_CONFIG.ESTUDIANTES.GET_ALL), { headers: authHeaders }),
          fetch("http://127.0.0.1:8000/materias/", { headers: authHeaders }),
        ]);

        if (!notasRes.ok || !estudiantesRes.ok || !materiasRes.ok) {
          console.error("Notas response:", notasRes);
          console.error("Estudiantes response:", estudiantesRes);
          console.error("Materias response:", materiasRes);
          throw new Error("Error en la red al cargar los datos");
        }

        const notasData = await notasRes.json();
        const estudiantesData = await estudiantesRes.json();
        const materiasData = await materiasRes.json();

        console.log("Estudiantes:", estudiantesData);
        console.log("Materias:", materiasData);

        setNotas(Array.isArray(notasData) ? notasData : notasData.notas || []);
        setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : estudiantesData.estudiantes || []);
        setMaterias(Array.isArray(materiasData) ? materiasData : materiasData.materias || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setNotas([]);
        setEstudiantes([]);
        setMaterias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getEstudianteNombre = (id) => {
    const estudiante = estudiantes.find((e) => e.id === id);
    return estudiante ? estudiante.nombre : "Desconocido";
  };

  const getMateriaNombre = (id) => {
    const materia = materias.find((m) => m.id === id);
    return materia ? materia.nombre : "Desconocida";
  };

  const guardarNota = async () => {
    // ... (sin cambios)
  };

  const crearNota = async () => {
    // ... (sin cambios)
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
            <th>Materia</th>
            <th>Nota</th>
            <th>Profesor</th>
            {user?.rol === "profesor" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>{getEstudianteNombre(nota.estudiante_id)}</td>
              <td>{getMateriaNombre(nota.materia_id)}</td>
              <td>{nota.nota}</td>
              <td>{nota.profesor_id}</td>
              {user?.rol === "profesor" && (
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
                  value={nuevaNotaData.materia_id}
                  onChange={(e) =>
                    setNuevaNotaData({
                      ...nuevaNotaData,
                      materia_id: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccione una materia</option>
                  {materias.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.nombre}
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
              >
                {isCreating ? "Crear" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotasPage;
