import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/auth.context";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AgregarCandidatoModal from "../../components/candidatos/AgregarCandidatoModal";
import ModificarCandidatoModal from '../../components/candidatos/ModificarCandidatoModal';
import { api } from "../../api";
import { useParams } from "react-router-dom";

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
  numeroDocumento: string;
  programa: Programa;
  email: string;
}
interface Candidato {
  idcandidatos: number;
  ideleccion: number;
  idaprendiz: number;
  nombres: string;
  numeroTarjeton: string;
  propuesta: string;
  foto: string;
}

const GestionCandidatos = () => {
  const [aprendices, setAprendices] = useState<Aprendiz[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalModificar, setShowModalModificar] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<any | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [elecciones, setElecciones] = useState<Eleccion[]>([]);
  const { idEleccion } = useParams<{ idEleccion: string }>();
  const [nombreEleccion, setNombreEleccion] = useState("");

  const fetchCandidatos = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const res = await api.get(
        `/api/candidatos/listar/cformacion/${user?.centroFormacion}`
      );

      const filtrados = res.data.data.filter((candidato: Candidato) => candidato.ideleccion === Number(idEleccion));
      setCandidatos(filtrados || []);

      if (!res.data) {
        throw new Error("Error al traer aprendices");
      }
      // console.log("candidatos: ", res.data);
      // console.log("idEleccion param: ", idEleccion);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchAprendices = async () => {
      try {
        const res = await api.get(`/api/aprendiz/centros/${user?.centroFormacion}`);
        if (!res.data) {
          throw new Error("Error al traer aprendices");
        }
        // console.log("aprendices: ", res.data);
        setAprendices(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchElecciones = async () => {
      try {
        const res = await api.get(`/api/eleccion/centrof/${user?.centroFormacion}`);
        if (!res.data) {
          throw new Error("Error al traer elecciones");
        }
        setNombreEleccion(res.data.data.find((e: Eleccion) => e.ideleccion === Number(idEleccion))?.nombre || "");
        console.log("elecciones: ", res.data);
        setElecciones(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchElecciones();
    fetchCandidatos();
    fetchAprendices();
  }, [isAuthenticated, user, elecciones.length, candidatos.length, aprendices.length]);

  if (!isAuthenticated) {
    return <p>Debes iniciar sesión para gestionar candidatos</p>;
  }

  const handleAgregarCandidato = (nuevo: Candidato) => {
    setCandidatos(prev => [...prev, nuevo]);
  };

  const onEditar = async (id: number) => {
    try {
      const response = await api.put(`/api/candidatos/actualizar/${id}`);

      const candidato = response.data.data;
      console.log(candidato);

      setCandidatoSeleccionado(candidato);
      setShowModalModificar(true);

    } catch (error: any) {
      console.error("Error al obtener candidato:", error.response?.data || error.message);
      alert("No se pudo cargar el candidato");
    }


  };

  const onEliminar = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este candidato?")) {
      try {
        setLoading(true);
        const response = await api.delete(`/api/candidatos/eliminar/${id}`);

        if (response.status === 200) {
          // Remove the deleted candidate from the state
          setCandidatos(prev => prev.filter(c => c.idcandidatos !== id));
          alert('Candidato eliminado correctamente');
        } else {
          throw new Error('Error al eliminar el candidato');
        }
      } catch (error) {
        console.error('Error al eliminar el candidato:', error);
        alert('Ocurrió un error al eliminar el candidato');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0">{nombreEleccion}</h2>
        <br />
        {/* <h3 className="text-muted">{nombreEleccion}</h3> */}
        <button
          className="btn btn-gradient d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={18} />
          Agregar Candidato
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4" style={{ width: 90 }}>Foto</th>
                  <th>Nombre Completo</th>
                  <th>Numero voto</th>
                  <th>Propuesta</th>
                  <th className="text-center" style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      Cargando candidatos...
                    </td>
                  </tr>
                ) : candidatos.length > 0 ? (
                  candidatos.map((c) => (
                    <tr key={c.idcandidatos}>
                      <td className="ps-4">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.nombres)}&background=random&size=128&rounded=true&bold=true&format=png`}
                          alt={`${c.nombres} `}
                          className="rounded-circle"
                          style={{ width: 48, height: 48, objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-semibold">
                        {c.nombres}
                      </td>
                      <td className="text-muted">{c.numeroTarjeton || "Sin programa"}</td>
                      <td className="text-muted">{c.propuesta}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-3">
                          <button
                            className="btn btn-sm p-0 border-0 text-primary"
                            title="Editar"
                            onClick={() => onEditar(c.idcandidatos)}
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            className="btn btn-sm p-0 border-0 text-danger"
                            title="Eliminar"
                            onClick={() => onEliminar(c.idcandidatos)}
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
                      No hay candidatos en este centro de formación.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            {/* boton de regresar */}
            <div className="d-flex justify-content-end p-3">
              <button
                className="btn btn-secondary"
                onClick={() => window.history.back()}
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      </div>

      {candidatoSeleccionado && (
        <ModificarCandidatoModal
          show={showModalModificar}
          onHide={() => setShowModalModificar(false)}
          candidato={candidatoSeleccionado}
          onSave={(candidatoEditado) => {
            setCandidatos(prev =>
              prev.map(c =>
                c.idcandidatos === candidatoEditado.idcandidatos ? candidatoEditado : c
              )
            );
            fetchCandidatos();
            setShowModalModificar(false);
            fetchCandidatos();
          }}
          aprendices={aprendices || []}
        />
      )}

      <AgregarCandidatoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAgregarCandidato}
        aprendices={aprendices || []}
        idEleccion={idEleccion ? parseInt(idEleccion) : undefined}
      />

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