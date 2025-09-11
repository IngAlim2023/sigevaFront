import React from "react";
import { Container, Row, Col, Card, Button, Badge, ListGroup } from "react-bootstrap";
import { BsCalendar3, BsPeople, BsGraphUp, BsCheck2Circle } from "react-icons/bs";
import imgAprendices from "../assets/img-aprendices.svg";
import Footer from "../components/Footer";
import "../Dashboard.css";
import "../Footer.css";

const Dashboard: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="main-content flex-grow-1">
      <Container fluid>
        {/* Bienvenida */}
        <Row className="mb-4">
          <Col>
          <h2 className="fw-bold">¡Bienvenido al Sistema de Gestión Electoral!</h2>
          <p className="text-muted">
            Administra las elecciones estudiantiles del SENA de manera digital, transparente y eficiente.
          </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button className="btn-morado">Nueva Elección</Button>
              <Button className="btn-morado-outline">Ver Reportes</Button>
            </div>
        </Col>
      </Row>

      <Row>
        {/* Columna izquierda */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="text-success mb-3">Próximas Elecciones</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Representante Centro Agropecuario</strong>
                  <div>La Dorada, Caldas</div>
                  <Badge bg="light" text="success" className="mt-2">
                    22-24 Mar
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Representante Centro Agropecuario</strong>
                  <div>La Dorada, Caldas</div>
                  <Badge bg="light" text="success" className="mt-2">
                    22-24 Mar
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Representante Centro Agropecuario</strong>
                  <div>La Dorada, Caldas</div>
                  <Badge bg="light" text="success" className="mt-2">
                    22-24 Mar
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha */}
        <Col lg={4}>
            <div className="position-relative mb-4" style={{ width: '100%', maxWidth: '900px' }}>
              <div style={{ 
                width: '100%', 
                paddingBottom: '66.67%', /* 408/612 = 0.6667 */
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.5rem',
                margin: '0 auto'
              }}>
                <img 
                  src={imgAprendices} 
                  alt="Aprendices" 
                  className="position-absolute top-0 start-0 w-100 h-100" 
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="position-absolute" style={{ bottom: '-20px', right: '20px' }}>
                <Badge bg="success" className="p-3 d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                  <BsCheck2Circle size={20} />
                  <div>
                    74% Participación
                    <br />
                    <small style={{ fontSize: '0.9rem' }}>Promedio Nacional</small>
                  </div>
                </Badge>
              </div>
            </div>

          <Card>
            <Card.Body>
              <h5 className="text-success mb-3">Acciones Rápidas</h5>
              <ListGroup variant="flush">
                <ListGroup.Item action className="d-flex align-items-center gap-2">
                  <BsCalendar3 className="text-primary" />
                  <span>Programar Elección</span>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center gap-2">
                  <BsPeople className="text-primary" />
                  <span>Importar Votantes</span>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center gap-2">
                  <BsGraphUp className="text-primary" />
                  <span>Generar Reporte</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        </Row>
      </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
