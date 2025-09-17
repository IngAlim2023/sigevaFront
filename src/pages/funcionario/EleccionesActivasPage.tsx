import { Row, Col, Container, Button } from "react-bootstrap";
import EleccionCard from "../../components/EleccionCard";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import EleccionDetalleModal from "../../components/EleccionDetalleModal";
import { useAuth } from "../../context/auth/auth.context";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

interface Eleccion {
  ideleccion: number;
  titulo: string;
  centro: string;
  jornada: string | null;
  fechaInicio: string;
  fechaFin: string;
}

export default function EleccionesActivasPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEleccion, setSelectedEleccion] = useState<any | null>(null);
  const [eleccionActiva, setEleccionActiva] = useState<Eleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  const navegar = useNavigate()


  useEffect(() => {
    const loadData = async ()=> {
      if (!user?.centroFormacion) {
        return;
      }
      try{
      const res = await api.get(`/api/eleccion/traerTodas/${user?.centroFormacion}`)
      setEleccionActiva(res.data.eleccionesActivas)
      setLoading(false)
      } catch (error){
        console.error("Error al cargar las votaciones:", error)
      }
      
    }
    loadData()
  }, [user?.centroFormacion]);

  

  const formatDate = (dateStr: string ) => {
    if (!dateStr) return "Fecha no disponible";
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDetalles = (eleccion: Eleccion) => {
    setSelectedEleccion({
      ...eleccion,
      fechaInicio: formatDate(eleccion.fechaInicio),
      fechaFin: formatDate(eleccion.fechaFin),
    });
    setShowModal(true);
  };

  return (
    <Container className="my-4">
      {/* Título de bienvenida */}
      <h3 className="fw-bold">Bienvenido</h3>
      <p className="text-muted">
        Aquí tiene un resumen de la actividad reciente en SIGEVA.
      </p>

      {/* Subtítulo */}
      <h5 className="fw-semibold mt-5">Resumen de Elecciones Activas</h5>

      {/* Cards */}
      <Row className="g-2 my-2">
        {loading ? (
          <p>Cargando elecciones...</p>
        ) : eleccionActiva.length > 0 ? (
          eleccionActiva.map((vote) => (
            <Col key={vote.ideleccion} xs={12} md={6} lg={4}>
              <EleccionCard
                titulo={vote.titulo}
                regional={vote.centro}
                jornada={vote.jornada ?? "Sin jornada"}
                fechaInicio={formatDate(vote.fechaInicio)}
                fechaTerminacion={formatDate(vote.fechaFin)}
                onDetalles={() => handleDetalles(vote)}
              />
            </Col>
          ))
        ) : (
          <p>No hay elecciones activas en este momento.</p>
        )}
      </Row>

      {/* Botones inferiores */}
      <div className="d-flex justify-content-end gap-3 mt-5">
        <Button className="btn-gradient" onClick={()=> navegar('/cargar-aprendices')}>
          <FaPlusCircle /> Agregar votantes
        </Button>

        <Button className="btn-gradient" onClick={() => navegar('/nueva-eleccion')}>
          <FaPlusCircle /> Crear elección
        </Button>
      </div>

      {/* Modal de detalles */}
      <EleccionDetalleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        eleccion={selectedEleccion}
      />
    </Container>
  );
}
