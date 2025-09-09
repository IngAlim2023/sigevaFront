import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const MOCK = [
    {
        id: 1,
        nombre: "Sofía Ramírez",
        programa: "Tecnología en Desarrollo de Software",
        descripcion: "Estudiante destacada con habilidades en programación y liderazgo.",
        foto: "https://i.pravatar.cc/80?img=47",
    },
];

const GestionCandidatos = () => {
    const [candidatos, setCandidatos] = useState(MOCK);

    const onAgregar = () => {
        // aquí abres tu modal/form real
        alert("Abrir modal para agregar candidato");
    };

    const onEditar = (id: number) => {
        alert(`Editar candidato #${id}`);
    };

    const onEliminar = (id: number) => {
        if (confirm("¿Eliminar este candidato?")) {
            setCandidatos((prev) => prev.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="container my-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold m-0">Gestión de Candidatos</h2>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onAgregar}>
                    <FiPlus size={18} />
                    Agregar Candidato
                </button>
            </div>

            {/* Card/Table wrapper */}
            <div className="card border-1 shadow-sm mb-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4" style={{ width: 90 }}>Foto</th>
                                    <th>Nombre Completo</th>
                                    <th>Programa de Formación</th>
                                    <th>Descripción</th>
                                    <th className="text-center" style={{ width: 120 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidatos.map((c) => (
                                    <tr key={c.id}>
                                        <td className="ps-4">
                                            <img
                                                src={c.foto}
                                                alt={c.nombre}
                                                className="rounded-circle"
                                                style={{ width: 48, height: 48, objectFit: "cover" }}
                                            />
                                        </td>
                                        <td className="fw-semibold">{c.nombre}</td>
                                        <td className="text-muted">{c.programa}</td>
                                        <td className="text-muted">{c.descripcion}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-3">
                                                <button
                                                    className="btn btn-sm p-0 border-0"
                                                    title="Editar"
                                                    onClick={() => onEditar(c.id)}
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button
                                                    className="btn btn-sm p-0 border-0 text-danger"
                                                    title="Eliminar"
                                                    onClick={() => onEliminar(c.id)}
                                                >
                                                    <FiTrash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {candidatos.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5 text-muted">
                                            No hay candidatos. Haz clic en <strong>Agregar Candidato</strong>.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* estilos finos en línea para redondeo/card */}
            <style>{`
        .card { border-radius: 14px; }
        thead tr th { border-top: none; }
        tbody tr td { vertical-align: middle; }
        @media (max-width: 768px) {
          /* En móviles, oculta descripciones largas para que no se rompa */
          td:nth-child(4) { display:none; }
          th:nth-child(4) { display:none; }
        }
      `}</style>
        </div>
    );
};
export default GestionCandidatos;