import { Card, Col, Container, Row } from "react-bootstrap";
import { FaPlusCircle, FaUsers } from "react-icons/fa";
import { MdHowToVote, MdOutlineAssignment } from "react-icons/md";

export const DashboardAdmin = () => {
  return (
    <div>
      {" "}
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
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <MdHowToVote size={40} color="brown" />
                <Card.Title>Votaciones Activas</Card.Title>
                <Card.Text className="fs-4 fw-bold">8</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <FaUsers size={32} className="text-success mb-2" />
                <Card.Title>Usuarios Registrados</Card.Title>
                <Card.Text className="fs-4 fw-bold">256</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <MdOutlineAssignment size={40} color="#4285F4" />
                <Card.Title>Votos Totales Hoy</Card.Title>
                <Card.Text className="fs-4 fw-bold">1,280</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
      </Container>
    </div>
  );

};



