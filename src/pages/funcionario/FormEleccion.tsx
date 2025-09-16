import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

import "../funcionario/form.css";

function FormEleccion() {
  const [idcentro_formacion, setidCentroFormacion] = useState("");
  const [centroFormacion, setCentroFormacion] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  //const [jornada, setJornada] = useState<string>("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaCierre] = useState("");
  const [hora_inicio, setHoraInicio] = useState("");
  const [hora_fin, setHoraFin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://sigevaback-real.onrender.com/api/centrosFormacion/obtiene")
      .then((respuesta) => {
        setCentroFormacion(respuesta.data.data);
      })
      .catch((error) => {
        console.error("Error al obtener los centros", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://sigevaback-real.onrender.com/api/eleccion/crear",
        {
          idcentro_formacion: idcentro_formacion, 
          nombre,
          fecha_inicio: fecha_inicio,
          fecha_fin: fecha_fin,
          hora_inicio: `${fecha_inicio} ${hora_inicio}:00`,
          hora_fin: `${fecha_fin} ${hora_fin}:00`
        }
      );
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
          <Col xs={12} md={10} lg={8} xl={7}>
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
                  <Form.Label>Centro de formación al que pertenece</Form.Label>
                  <Form.Select
                    value={idcentro_formacion}
                    onChange={(e) => setidCentroFormacion(e.target.value)}
                    required
                  >
                    <option value="">Seleccione centro de formación</option>
                    {centroFormacion.map((centro) => (
                      <option
                        value={centro.idcentroFormacion}
                        key={centro.idcentroFormacion}
                      >
                        {centro.centroFormacioncol}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/*<Form.Group className="mb-4">
                  <Form.Label>Jornada</Form.Label>
                  <div className="d-flex gap-2">
                    {["Mañana", "Tarde", "Noche"].map((opcion) => (
                      <Button
                        key={opcion}
                        variant={
                          jornada === opcion ? "primary" : "outline-primary"
                        }
                        onClick={() => setJornada(opcion)}
                        className="flex-grow-1"
                      >
                        {opcion}
                      </Button>
                    ))}
                  </div>
                </Form.Group>*/}

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
