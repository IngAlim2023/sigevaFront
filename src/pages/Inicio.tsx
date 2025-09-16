import { Container, Row, Col, Button } from "react-bootstrap";
import Sigeva from "../assets/sena-sigeva.svg";

const Inicio: React.FC = () => {
  return (
    <main className="min-vh-100 bg-white d-flex align-items-center justify-content-center px-3 py-5">
      <Container fluid className="px-4 px-md-5">
        <Row className="align-items-center justify-content-center gx-5">
          <Col
            xs={12}
            md={6}
            className="mb-5 mb-md-0 text-center text-md-start"
          >
            <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 mb-3">
              <img src={Sigeva} alt="Logo SIGEVA" height={40} />
            </div>

            <h1 className="fw-bold display-5 mb-3">
              Participa, elige y <br /> haz parte del cambio
            </h1>

            <p className="text-muted fs-5 mb-4">
              Una plataforma construida para que los aprendices del SENA puedan
              elegir a sus representantes, ejercer su voz y ser parte activa del
              cambio.
            </p>
            <a href="/equipo" target="_blank" className="text-decoration color-[#6136BF] text-muted mt-2 dec" style={{ color: '#6136BF' }}>Nuestro equipo</a>

            <div className="mb-4" style={{ marginTop: 50 }}>
              <Button
                href="/login-aprendiz"
                className="px-5 py-2 fw-semibold"
                style={{ backgroundColor: "#6136BF", border: "none" }}
              >
                Votar
              </Button>
            </div>
          </Col>

          <Col xs={12} md={6} className="d-none d-md-flex justify-content-end">
          <div className="d-flex flex-column align-items-center">
            <img
              src="/landing.png"
              alt="Aprendiz SENA votando"
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxHeight: 500, objectFit: "cover" }}
            />
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Inicio;
