import { useState } from "react";
import Navbar from "../Navbar";
import "../funcionario/form.css";
import { Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import axios from "axios";

function FormEleccion() {
  const [nombre, setNombre] = useState("");
  const [jornada, setJornada] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [horaInicio, setHoraInicio] = useState("");   
  const [horaFin, setHoraFin] = useState("");         

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

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
      alert("Elección creada");
    } catch (e) {
      console.error("Error al crear elección:", e);
      alert("Error al crear elección");
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h3 className="fw-bold">Crear nueva elección</h3>
            <p className="text-muted">
              Complete el formulario para configurar una nueva votación.
            </p>

            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
              {/* Nombre */}
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la elección</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Representante de aprendices 2024"
                  required
                />
              </Form.Group>

              {/* Jornada */}
              <Form.Group className="mb-3">
                <Form.Label>Jornada</Form.Label>
                <br />
                <ToggleButtonGroup
                  type="radio"
                  name="jornada"
                  value={jornada}
                  onChange={setJornada}
                >
                  <ToggleButton id="jornada-1" value="Mañana" className="btn-morado">
                    Mañana
                  </ToggleButton>
                  <ToggleButton id="jornada-2" value="Tarde" className="btn-morado">
                    Tarde
                  </ToggleButton>
                  <ToggleButton id="jornada-3" value="Noche" className="btn-morado">
                    Noche
                  </ToggleButton>
                </ToggleButtonGroup>
              </Form.Group>

              {/* Fechas y Horas */}
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de inicio</Form.Label>
                    <Form.Control type="date" required value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de cierre</Form.Label>
                    <Form.Control type="date" required value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora de inicio</Form.Label>
                    <Form.Control type="time" required value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora de fin</Form.Label>
                    <Form.Control type="time" required value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              {/* Botón */}
              <Button type="submit" className="btn-morado">
                Crear elección
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FormEleccion;
