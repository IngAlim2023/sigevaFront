import { Card } from "react-bootstrap";

interface Props {
  nombre: string;
  programa: string;
  propuesta: string;
  foto: string;
  seleccionado: boolean;
  onSelect: () => void;
}

export default function CandidateCard({
  nombre,
  programa,
  propuesta,
  foto,
  seleccionado,
  onSelect,
}: Props) {
  return (
    <Card
      className={`h-100 shadow-sm ${seleccionado ? "border-1 border-primary" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={onSelect}
    >
      <Card.Img
        variant="top"
        src={foto}
        style={{ height: "250px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title className="fw-bold">{nombre}</Card.Title>
        <Card.Subtitle className="text-muted">{programa}</Card.Subtitle>
        <Card.Text className="mt-2">{propuesta}</Card.Text>
        {/* <Card.Text className="text-success fw-semibold">
          Ver descripción ampliada <span>▼</span>
        </Card.Text> */}
      </Card.Body>
    </Card>
  );
}
