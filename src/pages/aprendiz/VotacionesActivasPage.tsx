import { Col, Container, Row } from "react-bootstrap";
import { VotacionCard } from "../../components/VotacionCard";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/auth/auth.context";

// const votaciones = [
//   {
//     regional: "Regional Bogotá D.C.",
//     titulo: "Representante de Aprendices 2024",
//     centro: "Centro de Servicios Empresariales y Turísticos",
//     jornada: "Mañana",
//   },
//   {
//     regional: "Regional Antioquia",
//     titulo: "Elección Delegados Curriculares",
//     centro: "Centro de Tecnología de la Manufactura Avanzada",
//     jornada: "Tarde",
//   },
//   {
//     regional: "Regional Valle del Cauca",
//     titulo: "Representante Bienestar al Aprendiz",
//     centro: "Centro de Electricidad y Automatización Industrial",
//     jornada: "Noche",
//   },
// ];

const VotacionesActivasPage = () => {
  const [votaciones, setVotaciones] = useState<any[]>([]);
  const { user } = useAuth<any>();

  console.log("user", user)
  useEffect(() => {
    const loadVotaciones = async () => {
      const { data } = await api.get(`api/eleccionPorCentro/${user.centroFormacion}`);
      setVotaciones(data.eleccionesActivas);
    }
    loadVotaciones();
  }, []);

  console.log("votaciones", votaciones)


  return (
    <>
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
