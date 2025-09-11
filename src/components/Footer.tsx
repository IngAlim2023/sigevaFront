import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLink } from 'react-icons/fa';
import { BsArrowUpCircle } from 'react-icons/bs';
import logo from '../assets/icon-sena-2.svg';
import '../Footer.css';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          {/* Logo y descripción */}
          <Col lg={4} className="mb-4 mb-lg-0">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <img src={logo} alt="SIGEVA" className="footer-logo" />
                
              </div>
              <p className="text-muted mb-3" style={{ fontSize: '0.925rem', lineHeight: '1.6' }}>
                Sistema de Gestión Electoral para aprendices del SENA. Promoviendo la democracia estudiantil de manera digital.
              </p>
              <div className="social-links">
                <a href="https://www.facebook.com/SENA/?locale=es_LA" aria-label="Facebook"><FaFacebook /></a>
                <a href="https://x.com/SENAComunica" aria-label="Twitter"><FaTwitter /></a>
                <a href="https://www.instagram.com/sena.regionalcauca/" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://www.youtube.com/@SENAComunica" aria-label="YouTube"><FaYoutube /></a>
              </div>
            </div>
          </Col>

          {/* Enlaces rápidos */}
          <Col md={4} lg={3}>
            <div className="footer-section">
              <h6>Enlaces Rápidos</h6>
              <ul className="list-unstyled">
                <li><a href="#">Inicio</a></li>
                <li><a href="#">Próximas Elecciones</a></li>
                <li><a href="#">Resultados Anteriores</a></li>
                <li>
                  <a 
                    href="https://portal.senasofiaplus.edu.co/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="d-inline-flex align-items-center"
                  >
                    <FaLink className="me-1" size={14} /> SENA Sofía Plus
                  </a>
                </li>
              </ul>
            </div>
          </Col>

          {/* Contacto */}
          <Col md={4} lg={3}>
            <div className="footer-section">
              <h6>Contacto</h6>
              <ul className="list-unstyled">
                <li className="mb-2">Servicio Nacional de Aprendizaje SENA</li>
                <li className="mb-2">Calle 57 No. 8 - 69 Bogotá D.C. (Cundinamarca), Colombia</li>
                <li className="mb-2">El SENA brinda a la ciudadanía, atención presencial en las 33 Regionales y 118 Centros de Formación</li>
                <li className="mb-2">
                  <a href="mailto:contacto@misena.edu.co" className="text-reset">
                    contacto@misena.edu.co
                  </a>
                </li>
                <li>
                  <a href="tel:+571234567890" className="text-reset">
                  3112545028
                  </a>
                </li>
              </ul>
            </div>
          </Col>

          {/* Botón flotante de ir arriba */}
          <div 
            className="position-fixed"
            onClick={scrollToTop}
            title="Ir arriba"
            role="button"
            aria-label="Volver arriba"
          >
            <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '46px', height: '46px' }}>
              <BsArrowUpCircle size={24} />
            </div>
          </div>
        </Row>
        
        <div className="footer-divider"></div>
        
        {/* Copyright */}
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} SIGEVA - SENA. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
