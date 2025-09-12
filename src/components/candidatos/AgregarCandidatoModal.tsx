import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FiUpload } from "react-icons/fi";

interface AgregarCandidatoModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (candidato: any) => void;
}

const AgregarCandidatoModal = ({ show, onHide, onSave }: AgregarCandidatoModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    programa: "",
    descripcion: "",
    foto: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar datos antes de guardar
    if (formData.nombre && formData.programa) {
      onSave({
        ...formData,
        id: Date.now(), // ID temporal
        foto: formData.foto || "https://i.pravatar.cc/80?img=68" // Imagen por defecto
      });
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Agregar Nuevo Candidato</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <div className="text-center mb-3">
                <div className="position-relative d-inline-block">
                  <img
                    src={formData.foto || "https://via.placeholder.com/150"}
                    alt="Preview"
                    className="rounded-circle mb-2"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2" style={{ cursor: 'pointer' }}>
                    <FiUpload size={20} />
                    <input
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({
                              ...prev,
                              foto: reader.result as string
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-muted small mt-2">Haz clic para subir una foto</p>
              </div>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Programa de Formación</Form.Label>
                <Form.Control
                  as="select"
                  name="programa"
                  value={formData.programa}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un programa</option>
                  <option value="Tecnología en Desarrollo de Software">Tecnología en Desarrollo de Software</option>
                  <option value="Tecnología en Sistemas">Tecnología en Sistemas</option>
                  <option value="Técnico en Programación">Técnico en Programación</option>
                  <option value="Técnico en Redes">Técnico en Redes</option>
                </Form.Control>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Breve descripción del candidato y sus propuestas"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="outline-secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-gradient">
              Guardar Candidato
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarCandidatoModal;