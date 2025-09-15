import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import Sigeva from "../assets/Sigeva logo.svg"

const Inicio: React.FC = () => {

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <Card className="p-4 rounded-4">
          <div className="text-center mb-4">
            <h1>Bienvenido a</h1>
            <img src={`${Sigeva}`} alt="Logo" height="50px" />
            <p className="mt-4">Selecciona tu rol para ingresar</p>
          </div>
              <Row className="justify-content-between">
                <Col xs={12} md={5} className="rounded-2 mb-2" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
                  <a
                    href="/login-aprendiz"
                    className="btn btn-lg w-100 text-white btn-aprendiz"
                  >
                    <FaUserGraduate className="me-2" />
                    Soy Aprendiz
                  </a>
                </Col>
                <Col xs={12} md={5} className="rounded-2 mb-2" style={{ background: "linear-gradient(135deg, #2575fc, #6a11cb)" }}>
                  <a
                    href="/login"
                    className="btn btn-lg w-100 text-white btn-funcionario"
                  >
                    <FaUserTie className="me-2" />
                    Soy Funcionario
                  </a>
                </Col>
              </Row>
            </Card>
            <p className="mt-4 text-light">
              Sistema de Gestión de Votos para Aprendices.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inicio;
