import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './asignacionMateriaEstudiante.css';

const AsignacionMateriaEstudiante = () => {

    const [materias, setMaterias] = useState([]);
    const [estudiantes, setEstudiantes]= useState([]);
    const [estudio_id, setEstudioId]= useState("");
    const [fecha_inscripcion, setFechaInscripcion]= useState("");
    const [id_seleccionados, setIdSeleccionados]= useState([]);
    const [assignedIds, setAssignedIds] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() =>{
        fetch('/estudios/estudios_get')
        .then(res => res.json())
        .then(data => setMaterias(data))
    }, [])

    useEffect(() =>{
        fetch('/estudiantes/estudiante_view')
        .then((res)=> res.json())
        .then((data)=> setEstudiantes(data))
    }, [])

    // When a materia (estudio_id) is selected, fetch students already assigned to it
    useEffect(() => {
        if (!estudio_id) {
            setAssignedIds([]);
            return;
        }

        const url = `/profesores/profesores/estudiantes_por_materia?materia_id=${encodeURIComponent(Number(estudio_id))}`;
        fetch(url)
            .then((res) => {
                if (res.status === 404) return [];
                if (!res.ok) throw new Error(`Error fetching assigned students: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const ids = Array.isArray(data) ? data.map(s => s.id) : [];
                setAssignedIds(ids);
                // remove any selected IDs that are now assigned
                setIdSeleccionados(prev => prev.filter(id => !ids.includes(id)));
            })
            .catch((err) => {
                console.error('Error loading assigned students for materia', err);
                setAssignedIds([]);
            });
    }, [estudio_id]);

    const handleSubmit = (e) =>{
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        // Aquí puedes agregar la lógica para manejar el envío del formulario
        fetch('/asignaciones/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ estudiantes: id_seleccionados.map(Number), estudio_id: Number(estudio_id), fecha_inscripcion }),
        })
        .then((res) => res.json())
            .then((data) => {
                console.log("Asignación creada:", data);
                setSuccessMsg('Asignación creada correctamente');
                // Aquí puedes agregar lógica adicional después de crear la asignación
            })
        .catch((error) => {
            console.error("Error al crear la asignación:", error);
        });

        console.log("Formulario enviado con:", {estudio_id: Number(estudio_id), fecha_inscripcion, id_seleccionados: id_seleccionados.map(Number)});
    }

    const handleCheckboxChange = (estudianteId, checked) =>{
        setIdSeleccionados((pre)=>{
            if(checked){
                return [...pre, estudianteId];
            }else{
                return pre.filter(id => id !== estudianteId);
            }
        })
        
    }
    
    console.log("Componente AsignacionMateriaEstudiante renderizado");
    return (
        <div className="ame-container">
            <header className="ame-header">
                <Link to="/dashboard" className="ame-back">← Volver al Dashboard</Link>
                <h2 className="ame-title">Asignación de Materia a Estudiante</h2>
            </header>

            <form className="ame-form" onSubmit={handleSubmit}>
                <div className="ame-row">
                    <label className="ame-label">Materia</label>
                    <select className="ame-select" value={estudio_id} onChange={(e)=>setEstudioId(e.target.value)}>
                        <option value="">Selecciona una materia</option>
                        {materias.map((materia) =>(
                            <option key={materia.id} value={materia.id}>
                                {materia.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="ame-row">
                    <label className="ame-label">Fecha de Registro</label>
                    <input className="ame-input" type="date" value={fecha_inscripcion} onChange={(e) => setFechaInscripcion(e.target.value)} />
                </div>

                <fieldset className="ame-fieldset">
                    <legend>Seleccionar Estudiantes</legend>
                    {assignedIds.length > 0 && (
                        <div className="ame-note">{assignedIds.length} estudiante(s) ya asignado(s) a esta materia y fueron ocultados.</div>
                    )}
                    <ul className="ame-students-list">
                        {estudiantes
                            .filter(est => !assignedIds.includes(est.id))
                            .map((estudiante)=>(
                        <li key={estudiante.id} className="ame-student-item">
                            <div className="ame-student-left">
                                <label>
                                    <input type="checkbox" 
                                        checked={id_seleccionados.includes(estudiante.id)}
                                        onChange={(e) => handleCheckboxChange(estudiante.id, e.target.checked)}
                                    />
                                    <span className="ame-student-name">{estudiante.nombre} {estudiante.apellido}</span>
                                </label>
                            </div>
                            <div className="ame-student-meta">ID: {estudiante.id} - Correo: {estudiante.correo}</div>
                        </li>
                ))}
                    </ul>
                </fieldset>

                <div className="ame-actions">
                    <button className="ame-assign-btn" type="submit" disabled={!estudio_id || !fecha_inscripcion || id_seleccionados.length===0}>Asignar</button>
                    {successMsg && <div className="ame-success">{successMsg}</div>}
                </div>
            </form>

            <footer className="ame-footer">
                <div>Materia seleccionada: <strong>{estudio_id || '—'}</strong></div>
            </footer>
        </div>
    );
};

export default AsignacionMateriaEstudiante;