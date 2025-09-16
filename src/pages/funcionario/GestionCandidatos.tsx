import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/auth.context";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AgregarCandidatoModal from "../../components/candidatos/AgregarCandidatoModal";

interface Eleccion {
  ideleccion: number;
  nombre: string;
}
interface Programa {
  idprogramaFormacion: number;
  idnivelFormacion: number;
  idareaTematica: number;
  programa: string;
  codigoPrograma: string;
  version: string;
  duracion: number;
}
interface Aprendiz {
  idaprendiz: number;
  nombres: string;
  apellidos: string;
  programa: Programa;
  email: string;
}

const VITE_URL_BACK = import.meta.env.VITE_BASE_URL;

const GestionCandidatos = () => {
  const [aprendices, setAprendices] = useState<Aprendiz[]>([]);
  // const [candidatos, setCandidatos] = useState<Candidato[]>(MOCK);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated } = useAuth<any>();
  const [loading, setLoading] = useState(false);
  const [elecciones, setElecciones] = useState<Eleccion[]>([]);

  useEffect(() => {
    const fetchAprendices = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setLoading(true);
        const res = await fetch(
          //utlizar vite_url_back
          `${VITE_URL_BACK}/api/aprendiz/centros/${user.centroFormacion}`

        );
        if (!res.ok) {
          throw new Error("Error al traer aprendices");
        }
        const data = await res.json();
        console.log(data);
        setAprendices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchElecciones = async () => {
      try {
        const res = await fetch(`${VITE_URL_BACK}/api/eleccion`);
        if (!res.ok) {
          throw new Error("Error al traer elecciones");
        }
        const data = await res.json();
        console.log(data);
        setElecciones(data);

      } catch (error) {
        console.error(error);
      }
    };
    fetchElecciones();

    fetchAprendices();
  }, [isAuthenticated, user, elecciones.length]);

  if (!isAuthenticated) {
    return <p>Debes iniciar sesión para gestionar candidatos</p>;
  }

  const handleAgregarCandidato = (nuevo: Aprendiz) => {
    setAprendices(prev => [...prev, nuevo]);
  };

  const onEditar = (id: number) => {
    // Implementar lógica de edición
    const aprendiz = aprendices.find(c => c.idaprendiz === id);
    if (aprendiz) {
      // Aquí podrías abrir un modal de edición con los datos del aprendiz
      alert(`Editar aprendiz: ${aprendiz.nombres} ${aprendiz.apellidos}`);
    }
  };

  const onEliminar = (id: number) => {
    if (confirm("¿Está seguro de eliminar este aprendiz?")) {
      setAprendices(prev => prev.filter(c => c.idaprendiz !== id));
    }
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0">Gestión de Candidatos</h2>
        <button
          className="btn btn-gradient d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={18} />
          Agregar Candidato
        </button>
      </div>

      {/* Card/Table wrapper */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4" style={{ width: 90 }}>Foto</th>
                  <th>Nombre Completo</th>
                  <th>Programa de Formación</th>
                  <th>Correo Electrónico</th>
                  <th className="text-center" style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      Cargando aprendices...
                    </td>
                  </tr>
                ) : aprendices.length > 0 ? (
                  aprendices.map((a) => (
                    <tr key={a.idaprendiz}>
                      <td className="ps-4">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.nombres + ' ' + a.apellidos)}&background=random&size=128&rounded=true&bold=true&format=png`}
                          alt={`${a.nombres} ${a.apellidos}`}
                          className="rounded-circle"
                          style={{ width: 48, height: 48, objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-semibold">
                        {a.nombres} {a.apellidos}
                      </td>
                      <td className="text-muted">{a.programa?.programa || "Sin programa"}</td>
                      <td className="text-muted">{a.email}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-3">
                          <button
                            className="btn btn-sm p-0 border-0 text-primary"
                            title="Editar"
                            onClick={() => onEditar(a.idaprendiz)}
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            className="btn btn-sm p-0 border-0 text-danger"
                            title="Eliminar"
                            onClick={() => onEliminar(a.idaprendiz)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      No hay aprendices en este centro de formación.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para agregar nuevo candidato */}
      <AgregarCandidatoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAgregarCandidato}
        aprendices={aprendices}
        elecciones={elecciones || []}
      />

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