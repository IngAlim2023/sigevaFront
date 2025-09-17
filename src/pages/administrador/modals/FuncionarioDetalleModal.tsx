import React from "react";
import { Modal, Button } from "react-bootstrap";

interface FuncionarioDetalleModalProps {
  show: boolean;
  onHide: () => void;
  funcionario: any | null; // Puedes tipar con tu interfaz real
}

export const FuncionarioDetalleModal: React.FC<FuncionarioDetalleModalProps> = ({
  show,
  onHide,
  funcionario,
}) => {
  if (!funcionario) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Funcionario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Email:</strong> {funcionario.email}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={`badge bg-${
              funcionario.estado === "activo" ? "success" : "danger"
            }`}
          >
            {funcionario.estado}
          </span>
        </p>
        <p><strong>Centro de formación:</strong> {funcionario.idcentro_formacion}</p>
        <p><strong>ID:</strong> {funcionario.id}</p>
        {/* Si tu backend trae más datos como nombre, tel, programa, etc. 
            solo los agregas aquí */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
