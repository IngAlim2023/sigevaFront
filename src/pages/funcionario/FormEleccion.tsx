import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col} from "react-bootstrap";
import axios from "axios";

import "../funcionario/form.css";

function FormEleccion() {
  const [nombre, setNombre] = useState("");
  const [jornada, setJornada] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("API_URL", {
        nombre,
        jornada,
        fechaInicio,
        fechaCierre,
        horaInicio,
        horaFin,
      });
      console.log("Elección creada:", response.data);
      alert("Elección creada exitosamente");
      navigate("/elecciones");
    } catch (e) {
      console.error("Error al crear elección:", e);
      alert("Error al crear la elección");
    }
  };

  return (
    <div className="d-flex">
      
      <Container className="py-4">
        <Row className="justify-content-center">
        <Col xs={123} md={10} lg={8} xl={7}>
        <div className="form-container form-responsive">
              <h2 className="mb-4 fw-bold">Crear nueva elección</h2>
              <p className="text-muted mb-4">
                Complete el formulario para configurar una nueva votación.
              </p>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Nombre de la elección</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Elección de representante estudiantil 2024"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Jornada</Form.Label>
                  <div className="d-flex gap-2">
                    {['Mañana', 'Tarde', 'Noche'].map((opcion) => (
                      <Button
                        key={opcion}
                        variant={jornada === opcion ? 'primary' : 'outline-primary'}
                        onClick={() => setJornada(opcion)}
                        className="flex-grow-1"
                      >
                        {opcion}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha de inicio</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Hora de inicio</Form.Label>
                      <Form.Control
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha de cierre</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaCierre}
                        onChange={(e) => setFechaCierre(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Hora de cierre</Form.Label>
                      <Form.Control
                        type="time"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 mt-5">
                  <Button type="submit" size="lg" className="btn-primary">
                    Crear elección
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FormEleccion;
