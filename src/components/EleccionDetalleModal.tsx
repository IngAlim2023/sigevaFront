import { Modal, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

interface Eleccion {
  regional: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  jornada: string;
}

interface EleccionModalProps {
  show: boolean;
  onHide: () => void;
  eleccion: Eleccion | null;
}

export default function EleccionModal({
  show,
  onHide,
  eleccion,
}: EleccionModalProps) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body className="p-4">
        {eleccion && (
          <>
            <h4 className="fw-bold mb-3">{eleccion.titulo}</h4>
            <p className="text-muted">
              <FaCalendarAlt className="me-2" />
              {eleccion.fechaInicio} - {eleccion.fechaFin}
            </p>
            <p>
              <strong>Jornada:</strong> {eleccion.jornada}
            </p>
            <div className="d-flex gap-3 mt-4">
              <Button variant="secondary" onClick={onHide}>
                Volver
              </Button>
              <Button className="btn-gradient">Ver candidatos</Button>
              <Button className="btn-gradient">Ver Métricas</Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
