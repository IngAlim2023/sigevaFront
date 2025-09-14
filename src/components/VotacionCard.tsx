import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Props {
  regional: string;
  titulo: string;
  centro: string;
  jornada: string;
}

export const VotacionCard = ({ regional, titulo, centro, jornada }: Props) => {
  const navigate = useNavigate();
  return (
    <Card className="h-100 border-success border-1 ">
      <Card.Header className="text-muted">{regional}</Card.Header>
      <Card.Body>
        <Card.Title className="fw-bold">{titulo}</Card.Title>
        <Card.Text>{centro}</Card.Text>
        <Card.Text>
          <span className="fw-semibold">Jornada:</span> {jornada}
        </Card.Text>
        <Button className="btn-gradient" onClick={()=>{navigate("/seleccion")}}>Participar</Button>
      </Card.Body>
    </Card>
  );
};
