import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

interface Candidato {
  idcandidatos: number;
  nombres: string;
  apellidos: string;
  email: string;
  propuesta: string;
  numero_tarjeton: string;
}

interface AgregarCandidatoModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (data: FormData) => void;
  loading?: boolean;
  candidato?: Candidato;
}

const AgregarCandidatoModal = ({ 
  show, 
  onHide, 
  onSave, 
  loading = false,
  candidato 
}: AgregarCandidatoModalProps) => {
  const [formData, setFormData] = useState({
    nombres: candidato?.nombres || '',
    apellidos: candidato?.apellidos || '',
    email: candidato?.email || '',
    propuesta: candidato?.propuesta || '',
    numero_tarjeton: candidato?.numero_tarjeton || '',
    foto: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, foto: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataToSend.append(key, value as string | Blob);
      }
    });
    
    onSave(formDataToSend);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{candidato ? 'Editar Candidato' : 'Nuevo Candidato'}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!candidato}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Propuesta</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="propuesta"
                  value={formData.propuesta}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Número de Tarjetón</Form.Label>
                <Form.Control
                  type="text"
                  name="numero_tarjeton"
                  value={formData.numero_tarjeton}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Foto {!candidato && '(Opcional)'}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AgregarCandidatoModal;