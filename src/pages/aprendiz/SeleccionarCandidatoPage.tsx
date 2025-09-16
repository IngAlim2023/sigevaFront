import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CandidatoCard from "../../components/CandidatoCard";
import { useParams } from "react-router-dom";
import { api } from "../../api";



export default function CandidateSelectionPage() {
  const { id } = useParams();
  const [candidatos, setCandidatos] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await api.get(`/api/candidatos/listar/${id}`);
      setCandidatos(response.data.data);
    };
    loadData();
  }, []);
  console.log(candidatos)

  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<
    string | null
  >(null);

  return (
    <>
      {candidatos.length === 0 ?(
        <Container className="my-4 text-center">
          <div>
            No hay candicatos en esta eleccion disponibles.
          </div>
        </Container>
      ):(
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
                seleccionado={candidatoSeleccionado === c.aprendiz.nombres}
                onSelect={() => setCandidatoSeleccionado(c.aprendiz.nombres)}
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
      )}
      
    </>
  );
}
