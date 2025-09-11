import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, ListGroup, ProgressBar } from "react-bootstrap";
import { 
  BsCalendar3, 
  BsPeople, 
  BsGraphUp, 
  BsCheck2Circle,
  BsArrowRight
} from "react-icons/bs";
import imgAprendices from "../assets/img-aprendices.svg";
import "../Dashboard.css";

interface Election {
  id: number;
  title: string;
  location: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  progress: number;
}

const Dashboard: React.FC = () => {
  const [elections] = useState<Election[]>([
    {
      id: 1,
      title: 'Representante Centro Agropecuario',
      location: 'La Dorada, Caldas',
      date: '22-24 Mar',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 2,
      title: 'Representante Centro de Gestión',
      location: 'Manizales, Caldas',
      date: '25-27 Mar',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 3,
      title: 'Representante Bienestar',
      location: 'La Dorada, Caldas',
      date: 'En curso',
      status: 'ongoing',
      progress: 68
    }
  ]);

  return (
    <div className="dashboard-container">
      <Container fluid className="py-4">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-2">Panel de Control</h1>
            <p className="text-muted mb-0">
              Bienvenido al sistema de gestión electoral del SENA
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="d-flex align-items-center gap-2">
              Reportes
            </Button>
            <Button variant="primary" className="d-flex align-items-center gap-2">
              <BsCalendar3 /> Nueva Elección
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* Próximas Elecciones */}
          <Col lg={8}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-3 fw-bold">Próximas Elecciones</h5>
                
                <ListGroup variant="flush" className="election-list">
                  {elections.map((election) => (
                    <ListGroup.Item key={election.id} className="px-0 py-3 border-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1 fw-bold">{election.title}</h6>
                          <p className="text-muted small mb-2">
                            {election.location} • {election.date}
                          </p>
                          {election.status === 'ongoing' && (
                            <div className="mt-2">
                              <div className="d-flex justify-content-between small mb-1">
                                <span>Progreso</span>
                                <span>{election.progress}%</span>
                              </div>
                              <ProgressBar now={election.progress} variant="success" className="rounded" style={{ height: '6px' }} />
                            </div>
                          )}
                        </div>
                        <Badge 
                          bg={
                            election.status === 'ongoing' ? 'success' : 
                            election.status === 'upcoming' ? 'primary' : 'secondary'
                          }
                          className="px-3 py-2"
                        >
                          {election.status === 'ongoing' ? 'En Curso' : 'Próxima'}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Panel derecho */}
          <Col lg={4}>
            {/* Imagen destacada */}
            <div className="position-relative mb-4 rounded-3 overflow-hidden shadow-sm">
              <img 
                src={imgAprendices} 
                alt="Aprendices participando" 
                className="img-fluid w-100"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="position-absolute bottom-0 end-0 m-3">
                <Badge bg="success" className="p-3 d-flex align-items-center gap-2">
                  <BsCheck2Circle size={18} />
                  <div className="text-start">
                    <div className="fw-bold">74% Participación</div>
                    <small className="opacity-75">Promedio Nacional</small>
                  </div>
                </Badge>
              </div>
            </div>

            {/* Acciones rápidas */}
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-3 fw-bold">Acciones Rápidas</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item action className="d-flex align-items-center gap-3 px-0 py-3 border-0">
                    <div className="bg-light rounded p-2">
                      <BsCalendar3 className="text-primary" />
                    </div>
                    <span>Programar Elección</span>
                    <BsArrowRight className="ms-auto text-muted" />
                  </ListGroup.Item>
                  <ListGroup.Item action className="d-flex align-items-center gap-3 px-0 py-3 border-0">
                    <div className="bg-light rounded p-2">
                      <BsPeople className="text-primary" />
                    </div>
                    <span>Gestionar Candidatos</span>
                    <BsArrowRight className="ms-auto text-muted" />
                  </ListGroup.Item>
                  <ListGroup.Item action className="d-flex align-items-center gap-3 px-0 py-3 border-0">
                    <div className="bg-light rounded p-2">
                      <BsGraphUp className="text-primary" />
                    </div>
                    <span>Ver Estadísticas</span>
                    <BsArrowRight className="ms-auto text-muted" />
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
