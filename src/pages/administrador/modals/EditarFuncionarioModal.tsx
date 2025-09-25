import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { api } from "../../../api";
import Select from "react-select";

// Interfaces (sin cambios)
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
interface SelectOption {
  value: number;
  label: string;
}
interface FormData {
  nombres: string;
  apellidos: string;
  celular: string;
  numero_documento: string;
  email: string;
  estado: string;
  idcentro_formacion: number;
  idregional?: number;
  idperfil?: number;
  password: string;
}
interface EditarFuncionarioModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  onInputChange: (e: any) => void;
  error?: string;
  loading?: boolean;
}

export const EditarFuncionarioModal: React.FC<EditarFuncionarioModalProps> = ({
  show,
  onHide,
  onSubmit,
  formData,
  onInputChange,
  error,
  loading = false,
}) => {
  const [regionales, setRegionales] = useState<Regional[]>([]);
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Validaciones personalizadas
  const validateEmail = (email: string) => {
    if (!email) return null; // Email es opcional en edición
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    if (!email.includes(".com") && !email.includes(".co") && !email.includes(".edu")) {
      return false;
    }
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) return null; // Contraseña es opcional en edición
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
  };

  const validateNombres = (nombres: string) => {
    if (!nombres.trim()) return false;
    if (nombres.length < 2) return false;
    return true;
  };

  const validateApellidos = (apellidos: string) => {
    if (!apellidos.trim()) return false;
    if (apellidos.length < 2) return false;
    return true;
  };

  const validateCelular = (celular: string) => {
    if (!celular.trim()) return false;
    const celularRegex = /^[0-9]{10,15}$/;
    return celularRegex.test(celular);
  };

  const validateDocumento = (documento: string) => {
    if (!documento.trim()) return false;
    const documentoRegex = /^[0-9]{6,15}$/;
    return documentoRegex.test(documento);
  };

  // Estados de validación
  const emailValid = formData?.email ? validateEmail(formData.email) : null;
  const passwordValid = formData?.password ? validatePassword(formData.password) : null;
  const nombresValid = validateNombres(formData?.nombres || "");
  const apellidosValid = validateApellidos(formData?.apellidos || "");
  const celularValid = formData?.celular ? validateCelular(formData.celular) : null;
  const documentoValid = formData?.numero_documento ? validateDocumento(formData.numero_documento) : null;

  useEffect(() => {
    if (show) {
      api.get<Regional[]>("/api/regionales").then((res) => setRegionales(res.data));
      if (formData?.idregional) {
        api
          .get<{ data: CentroFormacion[] }>(`/api/centrosFormacion/obtiene/porRegional/${formData.idregional}`)
          .then((res) => setCentros(res.data.data));
      }
    }
  }, [show, formData?.idregional]);

  const optionsRegionales: SelectOption[] = regionales.map((r) => ({
    value: r.idregional,
    label: r.regional,
  }));

  const optionsCentros: SelectOption[] = centros.map((c) => ({
    value: c.idcentroFormacion,
    label: c.centroFormacioncol,
  }));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Funcionario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <div className="row g-3">
            {/* Nombres */}
            <Form.Group className="col-md-6">
              <Form.Label>Nombres <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={formData?.nombres || ""}
                onChange={onInputChange}
                isInvalid={!nombresValid}
                isValid={nombresValid}
              />
              {!nombresValid && (
                <Form.Control.Feedback type="invalid">
                  Mínimo 2 caracteres.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Apellidos */}
            <Form.Group className="col-md-6">
              <Form.Label>Apellidos <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                value={formData?.apellidos || ""}
                onChange={onInputChange}
                isInvalid={!apellidosValid}
                isValid={apellidosValid}
              />
              {!apellidosValid && (
                <Form.Control.Feedback type="invalid">
                  Mínimo 2 caracteres.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Celular */}
            <Form.Group className="col-md-6">
              <Form.Label>Celular <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="celular"
                value={formData?.celular || ""}
                onChange={onInputChange}
                isInvalid={celularValid === false}
                isValid={celularValid === true}
              />
              {celularValid === false && (
                <Form.Control.Feedback type="invalid">
                  Debe ser un número de 10 a 15 dígitos.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Número de documento */}
            <Form.Group className="col-md-6">
              <Form.Label>Número de documento <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="numero_documento"
                value={formData?.numero_documento || ""}
                onChange={onInputChange}
                isInvalid={documentoValid === false}
                isValid={documentoValid === true}
              />
              {documentoValid === false && (
                <Form.Control.Feedback type="invalid">
                  Debe ser un número de 6 a 15 dígitos.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Email */}
            <Form.Group className="col-md-6">
              <Form.Label>Correo</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={onInputChange}
                  isInvalid={emailValid === false}
                  isValid={emailValid === true}
                />
                <InputGroup.Text className="bg-white border-start-0">
                  {emailValid === true && <FaCheck className="text-success" />}
                  {emailValid === false && <FaTimes className="text-danger" />}
                </InputGroup.Text>
              </InputGroup>
              {emailValid === false && (
                <div className="text-danger small mt-1">
                  <FaTimes className="me-1" />Formato de email inválido (ej: usuario@dominio.com)
                </div>
              )}
            </Form.Group>

            {/* Contraseña (opcional en edición) */}
            <Form.Group className="col-md-6">
              <Form.Label>Contraseña <small className="text-muted">(opcional - dejar vacío para mantener actual)</small></Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData?.password || ""}
                  onChange={onInputChange}
                  placeholder="Nueva contraseña (opcional)"
                  isInvalid={passwordValid === false}
                  isValid={passwordValid === true}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <InputGroup.Text className="bg-white border-start-0">
                  {passwordValid === true && <FaCheck className="text-success" />}
                  {passwordValid === false && <FaTimes className="text-danger" />}
                </InputGroup.Text>
              </InputGroup>

              {/* Indicadores de validación de contraseña */}
              {formData?.password && (
                <div className="mt-2">
                  <div className="small">
                    <div className={formData.password.length >= 8 ? "text-success" : "text-danger"}>
                      {formData.password.length >= 8 ? <FaCheck /> : <FaTimes />} Mínimo 8 caracteres
                    </div>
                    <div className={/[A-Z]/.test(formData.password) ? "text-success" : "text-danger"}>
                      {/[A-Z]/.test(formData.password) ? <FaCheck /> : <FaTimes />} Una mayúscula
                    </div>
                    <div className={/[a-z]/.test(formData.password) ? "text-success" : "text-danger"}>
                      {/[a-z]/.test(formData.password) ? <FaCheck /> : <FaTimes />} Una minúscula
                    </div>
                    <div className={/\d/.test(formData.password) ? "text-success" : "text-danger"}>
                      {/\d/.test(formData.password) ? <FaCheck /> : <FaTimes />} Un número
                    </div>
                    <div className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-success" : "text-danger"}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? <FaCheck /> : <FaTimes />} Un carácter especial
                    </div>
                  </div>
                </div>
              )}
            </Form.Group>

            {/* Regional */}
            <div className="col-md-6">
              <Form.Label>Regional <span className="text-danger">*</span></Form.Label>
              <Select
                options={optionsRegionales}
                value={
                  optionsRegionales.find(
                    (opt) => opt.value === formData?.idregional
                  ) || null
                }
                onChange={(opt) =>
                  onInputChange({
                    target: { name: "idregional", value: opt ? opt.value : "" },
                  } as any)
                }
                placeholder="Selecciona una regional..."
              />
              {!formData?.idregional && (
                <div className="text-danger small mt-1">
                  <FaTimes className="me-1" />Campo requerido
                </div>
              )}
            </div>

            {/* Centro */}
            <div className="col-md-6">
              <Form.Label>Centro de Formación <span className="text-danger">*</span></Form.Label>
              <Select
                options={optionsCentros}
                value={
                  optionsCentros.find(
                    (opt) => opt.value === formData?.idcentro_formacion
                  ) || null
                }
                onChange={(opt) =>
                  onInputChange({
                    target: {
                      name: "idcentro_formacion",
                      value: opt ? opt.value : "",
                    },
                  } as any)
                }
                placeholder="Selecciona un centro..."
              />
              {!formData?.idcentro_formacion && (
                <div className="text-danger small mt-1">
                  <FaTimes className="me-1" />Campo requerido
                </div>
              )}
            </div>

            {/* Estado */}
            <Form.Group className="col-md-6">
              <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="estado"
                value={formData?.estado || ""}
                onChange={onInputChange}
                isInvalid={!formData?.estado}
              >
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Select>
              {!formData?.estado && (
                <Form.Control.Feedback type="invalid">
                  Campo requerido.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Perfil */}
            <Form.Group className="col-md-6">
              <Form.Label>Perfil <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="idperfil"
                value={formData?.idperfil || ""}
                onChange={onInputChange}
                isInvalid={!formData?.idperfil}
              >
                <option value="">Seleccione un perfil</option>
                <option value="2">Funcionario</option>
                <option value="1">Administrador</option>
              </Form.Select>
              {!formData?.idperfil && (
                <Form.Control.Feedback type="invalid">
                  Campo requerido.
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
