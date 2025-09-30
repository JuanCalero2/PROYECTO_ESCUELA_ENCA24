import { useEffect, useState } from "react";

const AsignacionMateriaEstudiante = () => {

    const [materias, setMaterias] = useState([]);
    const [estudiantes, setEstudiantes]= useState([]);
    const [estudio_id, setEstudioId]= useState("");
    const [fecha_inscripcion, setFechaInscripcion]= useState("");
    const [id_seleccionados, setIdSeleccionados]= useState([]);

    useEffect(() =>{
        fetch('estudios/estudios_get')
        .then(res => res.json())
        .then(data => setMaterias(data))
    }, [])

    useEffect(() =>{
        fetch('estudiantes/estudiante_view')
        .then((res)=> res.json())
        .then((data)=> setEstudiantes(data))
    }, [])

    const handleSubmit = (e) =>{
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        // Aquí puedes agregar la lógica para manejar el envío del formulario
        fetch('asignaciones/create', {
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
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Asignación de Materia a Estudiante</h2>
                <label>Materia:
                    <select
                        value={estudio_id} onChange={(e)=>setEstudioId(e.target.value)}>
                        <option>Selecciona </option>
                        {materias.map((materia) =>(
                            <option key={materia.id} value={materia.id}>
                                {materia.nombre}
                            </option>
                        ))}
                    </select>
                </label>
                
                <label>Fecha de Registro:
                    <input type="date" value={fecha_inscripcion} onChange={(e) => setFechaInscripcion(e.target.value)} />
                </label>
                {/* <label>
                    Estudiante:
                    <select value={estudiante_id} onChange={(e) => setEstudianteId(e.target.value)}>
                        <option>Selecciona </option>
                        {estudiantes.map((estudiante)=>(
                            <option key={estudiante.id} value={estudiante.id}>
                                {estudiante.nombre}
                            </option>
                        ))}
                    </select>
                </label> }*/}
                <label>
                    <ul>
                        {estudiantes.map((estudiante)=>(
                        <li key={estudiante.id}>
                            <input type="checkbox" 
                                checked={id_seleccionados.includes(estudiante.id)}
                                onChange={(e) => handleCheckboxChange(estudiante.id, e.target.checked)}
                            /> {estudiante.nombre}
                        </li>
                ))}
                    </ul>
                    
                </label>
                <div>
                    <button>Asignar</button>
                </div>
                
                
                <h2>Estudiantes</h2>
            </form>

            <h1>Materia seleccionada: {estudio_id}</h1>

            {/* Aquí puedes agregar el formulario o la lógica para asignar materias a estudiantes */}
        </div>
    );
};

export default AsignacionMateriaEstudiante;