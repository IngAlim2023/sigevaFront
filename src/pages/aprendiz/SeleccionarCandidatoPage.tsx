import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CandidatoCard from "../../components/CandidatoCard";

const candidatos = [
  {
    nombre: "Ana Rodríguez",
    programa: "Desarrollo de Software",
    propuesta:
      "Implementar nuevos laboratorios de innovación y tecnología para todos los aprendices.",
    foto: "/images/candidate1.png",
  },
  {
    nombre: "Carlos Mendoza",
    programa: "Gestión Empresarial",
    propuesta:
      "Fomentar el emprendimiento a través de alianzas estratégicas con el sector productivo.",
    foto: "/images/candidate2.png",
  },
  {
    nombre: "Sofía Ramírez",
    programa: "Diseño Gráfico",
    propuesta:
      "Crear más espacios de exposición para visibilizar el talento de los aprendices de diseño.",
    foto: "/images/candidate3.png",
  },
  {
    nombre: "Diego Vargas",
    programa: "Mecánica Industrial",
    propuesta:
      "Actualizar la maquinaria y herramientas de los talleres para una formación de vanguardia.",
    foto: "/images/candidate4.png",
  },
];

export default function CandidateSelectionPage() {
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<
    string | null
  >(null);

  return (
    <>
      <Container className="my-4 text-center">
        <h3 className="fw-bold">Selección de Candidato</h3>
        <p className="text-muted">
          Seleccione un candidato para ver sus propuestas y emitir su voto.
        </p>

        <Row className="g-4 my-4">
          {candidatos.map((c, index) => (
            <Col key={index} xs={12} md={6} lg={3}>
              <CandidatoCard
                {...c}
                seleccionado={candidatoSeleccionado === c.nombre}
                onSelect={() => setCandidatoSeleccionado(c.nombre)}
              />
            </Col>
          ))}
        </Row>

        {candidatoSeleccionado && (
          <div className="d-flex justify-content-center mt-4">
            <Button className="btn-gradient">
              Votar por {candidatoSeleccionado}
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}
