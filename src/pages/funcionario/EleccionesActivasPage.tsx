import { Row, Col, Container, Button } from "react-bootstrap";
import EleccionCard from "../../components/EleccionCard";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import EleccionDetalleModal from "../../components/EleccionDetalleModal";

interface Eleccion {
  regional: string;
  titulo: string;
  fechaInicio: string;
  fechaTerminacion: string;
  jornada: string;
}

const elecciones = [
  {
    regional: "Regional Cauca",
    titulo: "Representante de Aprendices 2024",
    fechaInicio: "15 de mayo de 2024",
    fechaTerminacion: "22 de mayo de 2024",
    jornada: "Diurna",
  },
  {
    regional: "Regional Cauca",
    titulo: "Elección Delegados Curriculares",
    fechaInicio: "1 de julio de 2024",
    fechaTerminacion: "16 de julio de 2024",
    jornada: "Nocturna",
  },
  {
    regional: "Regional Cauca",
    titulo: "Representante Bienestar al Aprendiz",
    fechaInicio: "1 de junio de 2024",
    fechaTerminacion: "8 de junio de 2024",
    jornada: "Diurna",
  },
];

export default function EleccionesActivasPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEleccion, setSelectedEleccion] = useState<Eleccion | null>(null)

  const handleDetalles = (eleccion: Eleccion) => {
    setSelectedEleccion(eleccion);
    setShowModal(true);
  };


  return (
    <Container className="my-4">
      {/* Título de bienvenida */}
      <h3 className="fw-bold">Bienvenido, Dr. Ricardo García</h3>
      <p className="text-muted">
        Aquí tiene un resumen de la actividad reciente en SIGEVA.
      </p>

      {/* Subtítulo */}
      <h5 className="fw-semibold mt-5">Resumen de Elecciones Activas</h5>

      {/* Cards */}
      <Row className="g-2 my-2">
        {elecciones.map((vote, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <EleccionCard {...vote} onDetalles={() => handleDetalles(vote)} />
          </Col>
        ))}
      </Row>

      {/* Botones inferiores */}
      <div className="d-flex justify-content-end gap-3 mt-5">
        <Button className="btn-gradient">
          <FaPlusCircle /> Agregar votantes
        </Button>

        <Button className="btn-gradient">
          <FaPlusCircle /> Crear elección
        </Button>
      </div>

      <EleccionDetalleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        eleccion={selectedEleccion}
      />
    </Container>
  );
}
