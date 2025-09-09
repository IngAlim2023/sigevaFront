import { Col, Container, Row } from "react-bootstrap";
import { VotacionCard } from "../../components/VotacionCard";
import Navbar from "../Navbar";
const votaciones = [
  {
    regional: "Regional Bogotá D.C.",
    titulo: "Representante de Aprendices 2024",
    centro: "Centro de Servicios Empresariales y Turísticos",
    jornada: "Mañana",
  },
  {
    regional: "Regional Antioquia",
    titulo: "Elección Delegados Curriculares",
    centro: "Centro de Tecnología de la Manufactura Avanzada",
    jornada: "Tarde",
  },
  {
    regional: "Regional Valle del Cauca",
    titulo: "Representante Bienestar al Aprendiz",
    centro: "Centro de Electricidad y Automatización Industrial",
    jornada: "Noche",
  },
];

const VotacionesActivasPage = () => {
  return (
    <>
      <Navbar />
      <Container className="my-4">
        <h3 className="fw-bold">Votaciones Activas</h3>
        <p className="text-muted">
          Participe en los procesos de elección de aprendices.
        </p>
        <Row className="g-4 my-4">
          {votaciones.map((vote, index) => (
            <Col key={index} xs={12} md={6} lg={4}>
              <VotacionCard {...vote} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default VotacionesActivasPage;
