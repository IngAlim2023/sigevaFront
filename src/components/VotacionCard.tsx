import { Card, Button } from "react-bootstrap";

interface Props {
  regional: string;
  titulo: string;
  centro: string;
  jornada: string;
}

export const VotacionCard = ({ regional, titulo, centro, jornada }: Props) => {
  return (
    <Card className="h-100 border-success border-1">
      <Card.Body className="d-grid gap-2">
        <Card.Subtitle className="text-muted mb-2">{regional}</Card.Subtitle>
        <Card.Title className="fw-bold">{titulo}</Card.Title>
        <Card.Text>{centro}</Card.Text>
        <Card.Text>
          <span className="fw-semibold">Jornada:</span> {jornada}
        </Card.Text>
        <Button
          style={{
            backgroundColor: "#5E2ABF",
          }}
        >
          Participar
        </Button>
      </Card.Body>
    </Card>
  );
};
