import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CandidatoCard from "../../components/aprendiz/CandidatoCard";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import SelecionarCandidato from "../../components/aprendiz/ModalCandidato";
import { FaArrowAltCircleLeft } from "react-icons/fa";


export default function CandidateSelectionPage() {
  const { id } = useParams();
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [idCandidato, setIdCandidato] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const response = await api.get(`/api/candidatos/listar/${id}`);
      setCandidatos(response.data.data);
    };
    loadData();
  }, []);

  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<{
    nombre: string;
    programa: string;
    propuesta: string;
    foto: string;
    numeroTarjeton: string;
    idCandidato: string;
  } | null>(null);


  return (
    <>
      {candidatos.length === 0 ? (
        <Container className="my-4 text-center">
          <div>
            No hay candicatos en esta eleccion disponibles.
          <div className="d-flex justify-content-start">
              <Button variant="success" onClick={()=>navigate("/votaciones")}><FaArrowAltCircleLeft/> Volver</Button></div>
          </div>
        </Container>
      ) : (
        <Container className="my-4 text-center">
          <h3 className="fw-bold">Selección de Candidato</h3>
          <p className="text-muted">
            Seleccione un candidato para ver sus propuestas y emitir su voto.
          </p>
          <div className="d-flex justify-content-start">
              <Button variant="success" onClick={()=>navigate("/votaciones")}><FaArrowAltCircleLeft/> Volver</Button>
          </div>
         

          <Row className="g-4 my-4">
            {candidatos.map((c, index) => (
              <Col key={index} xs={12} md={6} lg={3} onClick={() => setIdCandidato(c.idcandidatos)}>
                <CandidatoCard
                  {...c}
                  seleccionado={candidatoSeleccionado === c.aprendiz.nombres}
                  onSelect={() => setCandidatoSeleccionado(c.aprendiz.nombres)}
                  onMoreInfo={(data) => {
                    setCandidatoSeleccionado(data);
                    setShowModal(true);
                  }}
                  idCandidato={idCandidato}
                  setIdCandidato={setIdCandidato}
                />
              </Col>
            ))}
          </Row>

          {/* {candidatoSeleccionado && (
          <div className="d-flex justify-content-center mt-4">
            <Button className="btn-gradient">
              Votar por {candidatoSeleccionado}
            </Button>
          </div>
        )} */}

          <SelecionarCandidato
            show={showModal}
            onHide={() => setShowModal(false)}
            candidato={candidatoSeleccionado}

          />

        </Container>
      )}

    </>
  );
}
