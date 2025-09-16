import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";

interface Props {
  idcandidatos: string;
  nombre: string;
  programa: string;
  propuesta: string;
  foto: string;
  seleccionado: boolean;
  numeroTarjeton: string;
  onSelect: () => void;
  onMoreInfo: (data: {
    nombre: string;
    programa: string;
    propuesta: string;
    foto: string;
    numeroTarjeton: string;
    idCandidato: string;
  }) => void;
  aprendiz: {
    nombres: string;
    apellidos: string;

  };
  setIdCandidato: (id: string) => void;
  idCandidato: string;

}

export default function CandidateCard({
  programa,
  propuesta,
  foto,
  seleccionado,
  onSelect,
  onMoreInfo,
  aprendiz,
  numeroTarjeton,
  setIdCandidato,
  idCandidato,
  idcandidatos
}: Props) {
  return (
    <Card
      className={`h-100 shadow-sm ${seleccionado ? "border-1 border-primary" : ""}`}
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
        <Card.Text className="mt-2">{numeroTarjeton}</Card.Text>
        {/* <Card.Text className="text-success fw-semibold">
          Ver descripción ampliada <span>▼</span>
        </Card.Text> */}
        <Button variant="success" onClick={(e) => { e.stopPropagation(); setIdCandidato(idcandidatos); onMoreInfo({ nombre: `${aprendiz.nombres} ${aprendiz.apellidos}`, programa, propuesta, foto, numeroTarjeton, idCandidato: idcandidatos }); }}>Quiero Saber Más</Button>
      </Card.Body>
    </Card>
  );
}
