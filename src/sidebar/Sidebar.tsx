import React, { useState } from "react";
import { Nav, Offcanvas, Button } from "react-bootstrap";
import {
  BsHouseDoorFill,
  BsCalendarCheck,
  BsPeopleFill,
  BsBoxArrowRight,
  BsUpload,
  BsList
} from "react-icons/bs";
import "./sidebar.css"
import logo_sena from "../assets/icon-sena-sigeva.svg"
import logo2 from "../assets/icon-sena-2.svg"


const Sidebar: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Botón hamburguesa en móvil */}
      <Button variant="light" className="d-lg-none m-2" onClick={handleShow}>
        <BsList size={24} />
      </Button>

      {/* Sidebar fija (solo visible en >= lg) */}
      <aside className="sidebar-fixed d-none d-lg-flex">
        <div className="sidebar-logo">
          <img className="logo-sena" src={logo_sena} alt="" />
        </div>

        <Nav className="flex-column gap-2 sidebar-items">
          <Nav.Link href="#" className="sidebar-link"><BsHouseDoorFill className="me-2" />Home</Nav.Link>
          <Nav.Link href="#" className="sidebar-link"><BsCalendarCheck className="me-2" />Crear votación</Nav.Link>
          <Nav.Link href="#" className="sidebar-link"><BsPeopleFill className="me-2" />Elecciones</Nav.Link>
          <Nav.Link href="#" className="sidebar-link"><BsUpload className="me-2" />Subir Aprendices</Nav.Link>
        </Nav>

        <div className="sidebar-footer">
          <Nav.Link href="#" className="sidebar-link"><BsBoxArrowRight className="me-2" />Cerrar sesión</Nav.Link>
        </div>
      </aside>

      {/* Offcanvas para móvil (usa clase distinta para evitar conflicto de estilos) */}
      <Offcanvas show={show} onHide={handleClose} placement="start" className="sidebar-offcanvas">
        <Offcanvas.Header closeButton>
          <img className="logo-sena" src={logo2} alt="" />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-2">
            <Nav.Link href="#" className="sidebar-link" onClick={handleClose}><BsHouseDoorFill className="me-2" />Home</Nav.Link>
            <Nav.Link href="#" className="sidebar-link" onClick={handleClose}><BsCalendarCheck className="me-2" />Crear votación</Nav.Link>
            <Nav.Link href="#" className="sidebar-link" onClick={handleClose}><BsPeopleFill className="me-2" />Elecciones</Nav.Link>
            <Nav.Link href="#" className="sidebar-link" onClick={handleClose}><BsUpload className="me-2" />Subir Aprendices</Nav.Link>
            <div className="mt-3">
              <Nav.Link href="#" className="sidebar-link" onClick={handleClose}><BsBoxArrowRight className="me-2" />Cerrar sesión</Nav.Link>
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
