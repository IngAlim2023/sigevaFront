import React from "react";
import { Modal, Button } from "react-bootstrap";

// Interfaces
interface Regional {
  idregional: number;
  regional: string;
  telefono: string;
  direccion: string;
}

interface CentroFormacion {
  idcentroFormacion: number;
  centroFormacioncol: string;
  direccion: string;
  telefono: string;
  correo: string;
  subdirector: string;
  correosubdirector: string;
  regional: Regional;
}

interface Funcionario {
  id: number;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  numero_documento?: string;
  email: string;
  estado: string;
  centroFormacion?: CentroFormacion;
}

interface FuncionarioDetalleModalProps {
  showModal: boolean;
  handleClose: () => void;
  funcionario: Funcionario | null;
}

export const FuncionarioDetalleModal: React.FC<FuncionarioDetalleModalProps> = ({
  showModal,
  handleClose,
  funcionario,
}) => {
  if (!funcionario) return null;
  // console.log("Funcionario en modal:", funcionario); // Comentado para producción

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Funcionario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-primary mb-3">Información Personal</h6>
              <p><strong>Email:</strong> {funcionario.email}</p>
              <p><strong>Nombres:</strong> {funcionario.nombres || 'No disponible'}</p>
              <p><strong>Apellidos:</strong> {funcionario.apellidos || 'No disponible'}</p>
              <p><strong>Teléfono:</strong> {funcionario.celular || 'No disponible'}</p>
              <p><strong>Documento:</strong> {funcionario.numero_documento || 'No disponible'}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-primary mb-3">Estado</h6>
              <p>
                <span
                  className={`badge fs-6 ${
                    funcionario.estado === "activo" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {funcionario.estado.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          <hr className="my-4" />
          
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-primary mb-3">Centro de Formación</h6>
              <p><strong>Nombre:</strong> {funcionario.centroFormacion?.centroFormacioncol || 'No asignado'}</p>
              <p><strong>Dirección:</strong> {funcionario.centroFormacion?.direccion || 'No disponible'}</p>
              <p><strong>Teléfono:</strong> {funcionario.centroFormacion?.telefono || 'No disponible'}</p>
              <p><strong>Correo:</strong> {funcionario.centroFormacion?.correo || 'No disponible'}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-primary mb-3">Regional</h6>
              <p><strong>Regional:</strong> {funcionario.centroFormacion?.regional?.regional || 'No asignada'}</p>
              <p><strong>Dirección:</strong> {funcionario.centroFormacion?.regional?.direccion || 'No disponible'}</p>
              <p><strong>Teléfono:</strong> {funcionario.centroFormacion?.regional?.telefono || 'No disponible'}</p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
