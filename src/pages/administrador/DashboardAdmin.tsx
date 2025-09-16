import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { MdHowToVote, MdOutlineAssignment } from "react-icons/md";
import { FaUsers ,FaPlusCircle} from "react-icons/fa";
import { api } from "../../api";

export const DashboardAdmin = () => {
  const [votacionesActivas, setVotacionesActivas] = useState<number>(0);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<number>(0);
  const [votosHoy, setVotosHoy] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Votaciones activas
        const resActivas = await api.get("/api/eleccion/activas");
        setVotacionesActivas(resActivas.data.eleccionesActivas?.length || 0);

        // Usuarios registrados (aprendices)
        const resUsuarios = await api.get("/api/aprendiz/listar");
        setUsuariosRegistrados(resUsuarios.data?.length || 0);

        // Votos totales hoy
        const resVotos = await api.get("/api/votoXCandidato/traer");
        setVotosHoy(resVotos.data?.length || resVotos.data.totalVotosHoy || 0);
      } catch (error) {
        console.error("Error al traer datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Container fluid className="p-4 bg-light min-vh-100">
        <Row className="mb-4">
          <Col>
            <h2>
              Bienvenido de nuevo,{" "}
              <span
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: "32px",
                  color: "#5F2EEA",
                }}
              >
                Administrador
              </span>
            </h2>
            <p className="text-muted">
              Desde aquí puedes gestionar usuarios, supervisar el registro de
              aprendices y acceder a los reportes de votaciones realizadas en
              cada centro de formación.
            </p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h5>Resumen General</h5>
          </Col>
        </Row>

        <Row className="mb-4">
          {/* Votaciones Activas */}
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <MdHowToVote size={40} color="brown" />
                <Card.Title>Votaciones Activas</Card.Title>
                <Card.Text className="fs-4 fw-bold">
                  {votacionesActivas}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Usuarios Registrados */}
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <FaUsers size={40} color="#28a745" />
                <Card.Title>Usuarios Registrados</Card.Title>
                <Card.Text className="fs-4 fw-bold">
                  {usuariosRegistrados}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Votos Totales Hoy */}
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <MdOutlineAssignment size={40} color="#4285F4" />
                <Card.Title>Votos Totales Hoy</Card.Title>
                <Card.Text className="fs-4 fw-bold">{votosHoy}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Row className="mb-3">
          <Col>
            <h5>Accesos Directos</h5>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Card className="shadow-sm text-center p-4">
              <Card.Body>
                <FaPlusCircle size={40} className="text-primary mb-2" />
                <Card.Title>Añadir Usuario</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        </Row>
      </Container>
    </div>
  );

};



