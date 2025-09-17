import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../funcionario/form.css";
import { useAuth } from "../../context/auth/auth.context";
import { api } from "../../api";

function FormEleccion() {

  const [nombre, setNombre] = useState("");
  //const [jornada, setJornada] = useState<string>("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaCierre] = useState("");
  const [hora_inicio, setHoraInicio] = useState("");
  const [hora_fin, setHoraFin] = useState("");
  
  const {user} = useAuth()

  const navigate = useNavigate();



  const handleSubmit2 = async (e:React.FormEvent) =>{
    e.preventDefault()
      if(!user?.centroFormacion)return
      try {
        const response = await api.post(`/api/eleccion/crear`, 
          {
            idcentro_formacion: user?.centroFormacion,
            nombre,
            fecha_inicio,
            fecha_fin,
            hora_inicio: `${fecha_inicio} ${hora_inicio}:00`,
            hora_fin: `${fecha_fin} ${hora_fin}:00`,
            
          })

      alert("Elección creada exitosamente");
      navigate("/elecciones");
      console.log(response)

      } catch (error) {
        console.error("Error al crear eleccion", error)
      }
  }
  


  return (
    <div className="d-flex">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} xl={7}>
            <div className="form-container form-responsive">
              <h2 className="mb-4 fw-bold">Crear nueva elección</h2>
              <p className="text-muted mb-4">
                Complete el formulario para configurar una nueva votación.
              </p>

              <Form onSubmit={handleSubmit2}>
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

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha de inicio</Form.Label>
                      <Form.Control
                        type="date"
                        value={fecha_inicio}
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
                        value={hora_inicio}
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
                        value={fecha_fin}
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
                        value={hora_fin}
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
