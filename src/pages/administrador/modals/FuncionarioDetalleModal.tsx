import React from "react";
import { Modal, Button } from "react-bootstrap";

interface FuncionarioDetalleModalProps {
  showModal: boolean;
  handleClose: () => void;
  funcionario: any | null; // Tipar con tu interfaz real
}

export const FuncionarioDetalleModal: React.FC<FuncionarioDetalleModalProps> = ({
  showModal,
  handleClose,
  funcionario,
}) => {
  if (!funcionario) return null;
  console.log("Funcionario en modal:", funcionario);

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Funcionario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          {/* <p><strong>Nombre:</strong> {funcionario.nombre}</p> */}
          <p><strong>Email:</strong> {funcionario.email}</p>
          {/* <p><strong>Teléfono:</strong> {funcionario.telefono}</p> */}
          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={`badge ${
                funcionario.estado === "activo" ? "bg-success" : "bg-danger"
              }`}
            >
              {funcionario.estado}
            </span>
          </p>

          <hr />
          <h6>Centro de Formación</h6>
          <p><strong>Centro:</strong> {funcionario.centroFormacion?.centroFormacioncol}</p>
          <p><strong>Dirección:</strong> {funcionario.centroFormacion?.direccion}</p>
          <p><strong>Teléfono:</strong> {funcionario.centroFormacion?.telefono}</p>
          <p><strong>Correo:</strong> {funcionario.centroFormacion?.correo}</p>

          <hr />
          <h6>Regional</h6>
          <p><strong>Regional:</strong> {funcionario.centroFormacion?.regional?.regional}</p>
          <p><strong>Dirección:</strong> {funcionario.centroFormacion?.regional?.direccion}</p>
          <p><strong>Teléfono:</strong> {funcionario.centroFormacion?.regional?.telefono}</p>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
