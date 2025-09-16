import { Card } from "react-bootstrap";

interface Props {
  nombre: string;
  programa: string;
  propuesta: string;
  foto: string;
  seleccionado: boolean;
  onSelect: () => void;
  aprendiz:{
    nombres:string;
    apellidos:string;
  };
}

export default function CandidateCard({
  programa,
  propuesta,
  foto,
  seleccionado,
  onSelect,
  aprendiz
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
        <Card.Title className="fw-bold">{aprendiz.nombres} {aprendiz.apellidos}</Card.Title>
        <Card.Subtitle className="text-muted">{programa}</Card.Subtitle>
        <Card.Text className="mt-2">{propuesta}</Card.Text>
        {/* <Card.Text className="text-success fw-semibold">
          Ver descripción ampliada <span>▼</span>
        </Card.Text> */}
      </Card.Body>
    </Card>
  );
}
