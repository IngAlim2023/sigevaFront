import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

interface FuncionarioFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    email: string;
    estado: string;
    perfil: string;
    password?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing: boolean;
  error?: string;
  loading?: boolean;
}

export const FuncionarioFormModal: React.FC<FuncionarioFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  formData,
  onInputChange,
  isEditing,
  error,
  loading = false
}) => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    onSubmit(e);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <div>
          <Modal.Title className="fw-bold fs-4">
            {isEditing ? 'Editar Funcionario' : 'Nuevo Funcionario'}
          </Modal.Title>
          <p className="text-muted mb-0">
            {isEditing 
              ? 'Actualiza la información del funcionario' 
              : 'Registra un nuevo funcionario en el sistema.'
            }
          </p>
        </div>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="row g-3">
            <Form.Group className="col-md-6" controlId="email">
              <Form.Label>Correo Electrónico <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                required
                isInvalid={validated && (!formData.email || !validateEmail(formData.email))}
              />
              <Form.Control.Feedback type="invalid">
                {!formData.email ? 'El correo electrónico es requerido' : 'Ingrese un correo electrónico válido'}
              </Form.Control.Feedback>
            </Form.Group>

            {!isEditing && (
              <Form.Group className="col-md-6" controlId="password">
                <Form.Label>Contraseña <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={onInputChange}
                  required={!isEditing}
                  minLength={8}
                  isInvalid={validated && !isEditing && (!formData.password || formData.password.length < 8)}
                />
                <Form.Control.Feedback type="invalid">
                  {!formData.password ? 'La contraseña es requerida' : 'La contraseña debe tener al menos 8 caracteres'}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group className="col-md-6" controlId="estado">
              <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={onInputChange}
                required
                isInvalid={validated && !formData.estado}
              >
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione un estado
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="col-md-6" controlId="perfil">
              <Form.Label>Perfil <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="perfil"
                value={formData.perfil}
                onChange={onInputChange}
                required
                isInvalid={validated && !formData.perfil}
              >
                <option value="">Seleccione un perfil</option>
                <option value="Funcionario">Funcionario</option>
                <option value="Administrador">Administrador</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione un perfil
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear funcionario'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
