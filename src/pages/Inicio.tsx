import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sigeva from "../assets/sena-sigeva.svg";

const Inicio: React.FC = () => {
  return (
    <main className="min-vh-100 bg-white d-flex align-items-center justify-content-center px-3 py-5">
      <Container>
        <Row>
          <Col xs={12} className="p-0">
            <img
              src="/coverphoto.png"
              alt="Imagen SENA"
              className="w-100 mb-4"
              style={{ maxHeight: "230px", objectFit: "cover", borderRadius: "8px" }}
            />
          </Col>
        </Row>

        <Row className="justify-content-center text-center" style={{ marginTop: "30px" }}>
          <Col xs={12} md={10} lg={9}>
            <h1 className="fw-bold display-5 fs-1 mb-3" >
              Participa, elige y haz parte del cambio
            </h1>

            <p className="text-muted fs-6 mb-4 max-w-600 mx-auto" style={{ maxWidth: "700px" }}>
              Una plataforma construida para que los aprendices del SENA puedan
              elegir a sus representantes.
            </p>

            <div className="mb-4">
              <Button
                as={Link}
                to="/login-aprendiz"
                className="px-5 py-2 fw-semibold"
                style={{
                  backgroundColor: "#4CAF0C",
                  border: "none",
                  fontSize: "1.2rem",
                  marginTop: "20px",
                }}
              >
                Ingresar
              </Button>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 mt-8" style={{ marginTop: "60px" }}>
              <img src={Sigeva} alt="Logo SIGEVA" height={40} />
              <div
                className="d-none d-md-block"
                style={{ width: 1, height: 30, backgroundColor: "gray" }}
              />
              <img
                src="/logo_fabrica.png"
                alt="Logo fábrica de software"
                height={50}
              />
              <div
                className="d-none d-md-block"
                style={{ width: 1, height: 30, backgroundColor: "gray" }}
              />
              <Link
                to="/equipo"
                className="text-decoration-none fw-semibold text-muted"
              >
                Sobre nosotros
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Inicio;
