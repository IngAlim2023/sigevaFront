import { Card, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

interface EleccionCardProps {
  titulo: string;
  fechaInicio: string;
  fechaTerminacion: string;
  jornada: string;
  regional: string;
  onDetalles?: () => void;
  onCandidatos?: () => void;
}

export default function EleccionCard({
  titulo,
  fechaInicio,
  fechaTerminacion,
  jornada,
  regional,
  onDetalles,
  onCandidatos,
}: EleccionCardProps) {
  return (
    <Card className="h-100 border-success border-1">
      <Card.Header className="text-muted">{regional}</Card.Header>
      <Card.Body>
        <Card.Title className="fw-bold">{titulo}</Card.Title>
        <Card.Text>
          <span className="mb-1 text-muted">
            <FaCalendarAlt className="me-1" /> {fechaInicio} -{" "}
            {fechaTerminacion}
          </span>
        </Card.Text>
        <Card.Text>
          <span className="fw-semibold">Jornada:</span>
          {jornada}
        </Card.Text>
        <Button className="btn-gradient" onClick={onDetalles}>
          Detalles
        </Button>
        <Button className="btn-gradient" onClick={onCandidatos}>
          Gestionar candidatos
        </Button>
      </Card.Body>
    </Card>
  );
}
