import { Modal, Row, Col, Card, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import GeneracionReporte from "../pages/funcionario/GeneracionReporte";

interface Aprendiz {
  nombres: string;
  apellidos: string;
}

interface Candidato {
  idcandidatos: string;
  numeroTarjeton: string;
  foto: string;
  aprendiz: Aprendiz;
}

interface Eleccion {
  ideleccion: number;
  titulo: string;
  centro: string;
  jornada: string | null;
  fechaInicio: string;
  fechaFin: string;
}

interface EleccionDetalleModalProps {
  show: boolean;
  onClose: () => void;
  eleccion: Eleccion | null;
  candidatos: Candidato[];
}

export default function EleccionDetalleModal({
  show,
  onClose,
  eleccion,
  candidatos,
}: EleccionDetalleModalProps) {
  const [showReporte, setShowReporte] = useState(false);

  const handleGenerarReporte = () => {
    setShowReporte(true);
  };

  const handleVolverDeReporte = () => {
    setShowReporte(false);
  };

  if (!eleccion) return null;

  // Transformar datos para el componente GeneracionReporte
  const eleccionParaReporte = {
    ...eleccion,
    nombre: eleccion.titulo,
    candidatos: candidatos.map((candidato) => ({
      id: parseInt(candidato.idcandidatos),
      nombre: candidato.aprendiz.nombres,
      apellido: candidato.aprendiz.apellidos,
      votos: 0, // Por defecto, se puede actualizar con datos reales
      porcentaje: 0 // Por defecto, se puede actualizar con datos reales
    })),
    participantes: [], // Por defecto vacío, se puede actualizar con datos reales
    totalVotos: 0 // Por defecto, se puede actualizar con datos reales
  };

  return (
    <Modal show={show} onHide={onClose} size={showReporte ? "xl" : "lg"} centered>
      <Modal.Body className="p-4">
        {!showReporte ? (
          <>
            <h4 className="fw-bold mb-3">{eleccion.titulo}</h4>
            <p className="text-muted">
              <FaCalendarAlt className="me-2" />
              {eleccion.fechaInicio} - {eleccion.fechaFin}
            </p>
            <p>
              <strong>Jornada:</strong> {eleccion.jornada}
            </p>

            <Row className="g-3 mt-3">
              {candidatos.map((candidato) => (
                <Col key={candidato.idcandidatos} xs={6} md={4} lg={3}>
                  <Card className="shadow-sm text-center p-2" style={{ width: "140px" }}>
                    <Card.Img
                      src={candidato.foto}
                      alt={`${candidato.aprendiz.nombres} ${candidato.aprendiz.apellidos}`}
                      className="rounded-circle mx-auto d-block"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <Card.Body className="p-2">
                      <Card.Title className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        {candidato.aprendiz.nombres} {candidato.aprendiz.apellidos}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "0.8rem" }}>
                        Tarjetón: {candidato.numeroTarjeton}
                      </Card.Text>
                      
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="d-flex gap-3 mt-4">
              <Button variant="secondary" onClick={onClose}>
                Volver
              </Button>
              <Button className="btn-gradient" onClick={handleGenerarReporte}>Generar PDF</Button>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="outline-secondary" onClick={handleVolverDeReporte}>
                ← Volver al Detalle
              </Button>
            </div>
            <GeneracionReporte eleccion={eleccionParaReporte} />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
