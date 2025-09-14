import  Container  from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface Props {
  show: boolean;
  onHide: () => void;
  candidato: {
    nombre: string;
    programa: string;
    propuesta: string;
    foto: string;
  } | null;
}

export default function SelecionarCandidato({show, onHide, candidato}:Props) {
    if(!candidato) return null;
    return (
        <Container>

            <Modal show={show} onHide={onHide} centered size="lg" >
                <Modal.Header>

                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        {/* Columna de la imagen */}
                        <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                            <img src="https://dus6dayednven.cloudfront.net/app/uploads/2022/05/1-DSC00855-Editar_baja.jpg" alt="foto" className="img-fluid rounded"
                            style={{ width: "250px", height: "300px", objectFit: "cover" }} />
                        </Col>

                        {/* Columna de la información */}
                        <Col xs={12} md={8}>
                        <Row className="align-items-center mb-2">
                            <Col>
                                <h4 className="fw-bold m-0">Ana Rodríguez</h4>
                            </Col>
                            <Col xs="auto">
                                <h5 className="text-success fw-bold">002</h5>
                            </Col>
                        </Row>

                            <h6 className="text-muted">Desarrollo de Software</h6>
                            <p style={{ textAlign: "justify" }}>
                                Imdkfslafjdlsfjldsfkdsk Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Curabitur non erat vitae neque fringilla
                                ullamcorper.
                            </p>
                        </Col>
                    </Row>
                    <Container className="d-flex justify-content-between gap-3 mt-4">
                        <Button variant="danger" onClick={onHide}>Cancelar</Button>
                        <Button variant="success">Votar por este candidato</Button>
                    </Container>
                </Modal.Body>
            </Modal>
        </Container>
    )
}