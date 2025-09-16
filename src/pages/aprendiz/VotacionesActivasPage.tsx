import { Col, Container, Row } from "react-bootstrap";
import { VotacionCard } from "../../components/VotacionCard";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/auth/auth.context";


const VotacionesActivasPage = () => {
  const [votaciones, setVotaciones] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.CentroFormacion) {
        console.log("Usuario o CentroFormacion no disponible");
        return;
      }
      try {
        const response = await api.get(
          `/api/eleccionPorCentro/${user.CentroFormacion}`
        );
        setVotaciones(response.data.eleccionesActivas);
      } catch (error) {
        console.error("Error al cargar las votaciones:", error);
      }
    };
    loadData();
  }, [user?.CentroFormacion]);


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
