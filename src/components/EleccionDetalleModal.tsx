import { Modal, Row, Col, Card, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

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
  if (!eleccion) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Body className="p-4">
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
          <Button className="btn-gradient">Generar PDF</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
