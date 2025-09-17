
import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select"
import { api } from "../../api";

interface Aprendiz {
  idaprendiz: number;

import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";

interface Candidato {
  idcandidatos?: number;

  nombres: string;
  apellidos: string;
  email: string;
  propuesta: string;
  numero_tarjeton: string;
  foto_url?: string;
}

interface AgregarCandidatoModalProps {
  show: boolean;
  onHide: () => void;

  onSave: (candidato: any) => void;
  elecciones: Eleccion[];
  aprendices: Aprendiz[];
}

const AgregarCandidatoModal = ({ show, onHide, onSave, aprendices, elecciones }: AgregarCandidatoModalProps) => {

  onSave: (formData: FormData) => void;
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

  const [formData, setFormData] = useState<{
    nombres: string;
    apellidos: string;
    email: string;
    propuesta: string;
    numero_tarjeton: string;
    foto: File | null;
  }>({
    nombres: '',
    apellidos: '',
    email: '',
    propuesta: '',
    numero_tarjeton: '',
    foto: null
  });

  const [previewUrl, setPreviewUrl] = useState<string>(""); // para previsualizar


  const aprendizOptions = Array.isArray(aprendices)
    ? aprendices.map((a) => ({
      value: a.idaprendiz,
      label: `${a.nombres} ${a.apellidos}`.trim(),
    }))
    : [];


  const [previewUrl, setPreviewUrl] = useState<string>('');


  // Initialize form when candidato prop changes or modal is shown
  useEffect(() => {
    if (candidato) {
      setFormData({
        nombres: candidato.nombres || '',
        apellidos: candidato.apellidos || '',
        email: candidato.email || '',
        propuesta: candidato.propuesta || '',
        numero_tarjeton: candidato.numero_tarjeton || '',
        foto: null
      });
      if (candidato.foto_url) {
        setPreviewUrl(candidato.foto_url);
      }
    } else {
      // Reset form for new candidate
      setFormData({
        nombres: '',
        apellidos: '',
        email: '',
        propuesta: '',
        numero_tarjeton: '',
        foto: null
      });
      setPreviewUrl('');
    }
  }, [candidato, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("nombres", formData.nombres);
      data.append("ideleccion", String(formData.ideleccion));
      data.append("idaprendiz", String(formData.idaprendiz));
      data.append("propuesta", formData.propuesta);
      data.append("numero_tarjeton", String(formData.numero_tarjeton));

      if (formData.foto instanceof File) {
        data.append("foto", formData.foto);
      }
      console.log("Datos a enviar:", formData);

      const response = await api.post(
        `/api/candidatos/crear`,

        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Candidato creado:", response.data);
      alert("Candidato guardado satisfactoriamente");
      if (onSave) {
        onSave({
          ...response.data,
          programa: response.data.aprendiz?.programa?.programa ?? "",
        });
      }

      onHide();
    } catch (error: any) {
      console.error("Error al crear candidato:", error.response?.data || error.message);
      alert("Error al guardar candidato");
    }
  };

  const handleSelectChange = (selected: any) => {
    if (selected) {
      const aprendiz = aprendices.find((a) => a.idaprendiz === selected.value);
      setFormData({
        ...formData,
        idaprendiz: selected.value,
        nombres: aprendiz ? `${aprendiz.nombres} ${aprendiz.apellidos}` : "",
      });
    } else {
      setFormData({
        ...formData,
        nombres: "",
        idaprendiz: null,
      });
    }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, foto: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataToSend.append(key, value as string | Blob);
      }
    });
    
    onSave(formDataToSend);

  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{candidato ? 'Editar Candidato' : 'Nuevo Candidato'}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={4} className="text-center mb-3">
              <div className="mb-3">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="img-fluid rounded-circle mb-2"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <Form.Group>
                <Form.Label className="btn btn-outline-primary w-100">
                  Subir Foto
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="d-none"
                  />
                </Form.Label>
              </Form.Group>
            </Col>
            
            <Col md={8}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nombres *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Apellidos *</Form.Label>
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
                    <Form.Label>Email *</Form.Label>
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
                    <Form.Label>Número de Tarjetón *</Form.Label>
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
                    <Form.Label>Propuesta *</Form.Label>
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
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {candidato ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : candidato ? (
              'Actualizar'
            ) : (
              'Guardar'
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AgregarCandidatoModal;