import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaCheckCircle } from "react-icons/fa";
import { api } from "../../../api";
import Select from "react-select";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

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

interface SelectOption {
  value: number;
  label: string;
}

interface CrearFuncionarioModalProps {
  show: boolean;
  onHide: () => void;
  error?: string;
  loading?: boolean;
}

export const CrearFuncionarioModal: React.FC<CrearFuncionarioModalProps> = ({
  show,
  onHide,
  error,
  loading = false,
}) => {
  const [regionales, setRegionales] = useState<Regional[]>([]);
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [idRegional, setIdRegional] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [idCentroFormacion, setIdCentroFormacion] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdFuncionario, setCreatedFuncionario] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FieldValues>();

  // Validaciones personalizadas
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Formato de email inválido";
    if (!email.includes(".com") && !email.includes(".co") && !email.includes(".edu")) {
      return "El email debe tener un dominio válido (.com, .co, .edu)";
    }
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";
    if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula";
    if (!/\d/.test(password)) return "Debe contener al menos un número";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Debe contener al menos un carácter especial";
    return true;
  };

  // Observar valores para validaciones en tiempo real
  const watchedEmail = watch("email", "");
  const watchedPassword = watch("password", "");

  // Estados de validación
  const emailValid = watchedEmail ? validateEmail(watchedEmail) === true : null;
  const passwordValid = watchedPassword ? validatePassword(watchedPassword) === true : null;

  useEffect(() => {
    if (show) {
      api.get<Regional[]>("/api/regionales").then((res) => setRegionales(res.data));
      reset({});
    }
  }, [show, reset]);

  useEffect(() => {
    if (!idRegional) return;
    api
      .get<{ data: CentroFormacion[] }>(`/api/centrosFormacion/obtiene/porRegional/${idRegional}`)
      .then((res) => setCentros(res.data.data));
  }, [idRegional]);

  const optionsRegionales: SelectOption[] = regionales.map((r) => ({
    value: r.idregional,
    label: r.regional,
  }));

  const optionsCentros: SelectOption[] = centros.map((c) => ({
    value: c.idcentroFormacion,
    label: c.centroFormacioncol,
  }));

  const onSubmit = async (data: FieldValues) => {
    if (!idCentroFormacion) {
      return alert("Selecciona un centro de formación");
    }

    const submissionData = { ...data, idcentro_formacion: idCentroFormacion };

    try {
      await api.post("/api/usuarios/crear", submissionData);
      
      // Guardar el nombre del funcionario creado para el modal de éxito
      const nombreCompleto = `${data.nombres} ${data.apellidos}`;
      setCreatedFuncionario(nombreCompleto);
      
      // Resetear formulario
      setIdCentroFormacion(0);
      setIdRegional(0);
      reset();
      
      // Cerrar modal principal y mostrar modal de éxito
      onHide();
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear el funcionario";
      console.error('Error creating funcionario:', err);
      alert(message);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedFuncionario("");
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Funcionario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* Campos básicos */}
          <div className="row g-3">

            <Form.Group className="col-md-6">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                {...register("nombres", { required: "Los nombres son requeridos" })}
                isInvalid={!!errors.nombres}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombres?.message as string}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                {...register("apellidos", { required: "Los apellidos son requeridos" })}
                isInvalid={!!errors.apellidos}
              />
              <Form.Control.Feedback type="invalid">
                {errors.apellidos?.message as string}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="text"
                {...register("celular", { required: "El celular es requerido" })}
                isInvalid={!!errors.celular}
              />
              <Form.Control.Feedback type="invalid">
                {errors.celular?.message as string}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Estado</Form.Label>
              <Form.Select {...register("tipo_documento", { required: "Seleccione un estado" })}>
                <option value="">Tipo documento</option>
                <option value="CC">Cédula de ciudadanía</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="col-md-6">
              <Form.Label>Número de documento</Form.Label>
              <Form.Control
                type="number"
                {...register("numero_documento", { required: "El tipo de documento es requerido" })}
                isInvalid={!!errors.numero_documento}
              />
              <Form.Control.Feedback type="invalid">
                {errors.numero_documento?.message as string}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="col-md-6">
              <Form.Label>Correo</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  {...register("email", { 
                    required: "El correo es requerido",
                    validate: validateEmail
                  })}
                  isInvalid={!!errors.email}
                  className={emailValid === true ? "is-valid" : emailValid === false ? "is-invalid" : ""}
                />
                <InputGroup.Text className="bg-white border-start-0">
                  {emailValid === true && <FaCheck className="text-success" />}
                  {emailValid === false && <FaTimes className="text-danger" />}
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errors.email?.message as string}
              </Form.Control.Feedback>
              {emailValid === true && (
                <div className="text-success small mt-1">
                  <FaCheck className="me-1" />Email válido
                </div>
              )}
            </Form.Group>

            {/* Contraseña (solo en crear) */}
            <Form.Group className="col-md-12">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "La contraseña es requerida",
                    validate: validatePassword
                  })}
                  isInvalid={!!errors.password}
                  className={passwordValid === true ? "is-valid" : passwordValid === false ? "is-invalid" : ""}
                  placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial"
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
              <Form.Control.Feedback type="invalid">
                {errors.password?.message as string}
              </Form.Control.Feedback>
              
              {/* Indicadores de validación de contraseña */}
              {watchedPassword && (
                <div className="mt-2">
                  <div className="small">
                    <div className={watchedPassword.length >= 8 ? "text-success" : "text-danger"}>
                      {watchedPassword.length >= 8 ? <FaCheck /> : <FaTimes />} Mínimo 8 caracteres
                    </div>
                    <div className={/[A-Z]/.test(watchedPassword) ? "text-success" : "text-danger"}>
                      {/[A-Z]/.test(watchedPassword) ? <FaCheck /> : <FaTimes />} Una mayúscula
                    </div>
                    <div className={/[a-z]/.test(watchedPassword) ? "text-success" : "text-danger"}>
                      {/[a-z]/.test(watchedPassword) ? <FaCheck /> : <FaTimes />} Una minúscula
                    </div>
                    <div className={/\d/.test(watchedPassword) ? "text-success" : "text-danger"}>
                      {/\d/.test(watchedPassword) ? <FaCheck /> : <FaTimes />} Un número
                    </div>
                    <div className={/[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword) ? "text-success" : "text-danger"}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword) ? <FaCheck /> : <FaTimes />} Un carácter especial
                    </div>
                  </div>
                </div>
              )}
            </Form.Group>

            

            {/* Regional */}
            <div className="col-md-6">
              <Form.Label>Regional</Form.Label>
              <Select
                options={optionsRegionales}
                value={optionsRegionales.find((o) => o.value === idRegional) || null}
                onChange={(opt) => setIdRegional(opt ? opt.value : 0)}
                placeholder="Selecciona una regional..."
              />
            </div>

            {/* Centro */}
            <div className="col-md-6">
              <Form.Label>Centro</Form.Label>
              <Select
                options={optionsCentros}
                value={optionsCentros.find((o) => o.value === idCentroFormacion) || null}
                onChange={(opt) => setIdCentroFormacion(opt ? opt.value : 0)}
                placeholder="Selecciona un centro..."
              />
            </div>

            {/* Estado */}
            <Form.Group className="col-md-6">
              <Form.Label>Estado</Form.Label>
              <Form.Select {...register("estado", { required: "Seleccione un estado" })}>
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Select>
            </Form.Group>

            {/* Perfil */}
            <Form.Group className="col-md-6">
              <Form.Label>Perfil</Form.Label>
              <Form.Select {...register("idperfil", { required: "Seleccione un perfil" })}>
                <option value="">Seleccione un perfil</option>
                <option value="2">Funcionario</option>
                <option value="1">Administrador</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Guardando..." : "Crear Funcionario"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      </Modal>

      {/* Modal de Éxito */}
      <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <FaCheckCircle className="text-success mb-3" size={48} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pt-0">
          <h4 className="text-success mb-3">¡Funcionario Creado Exitosamente!</h4>
          <p className="mb-3">
            El funcionario <strong>{createdFuncionario}</strong> ha sido registrado correctamente en el sistema.
          </p>
          <p className="text-muted small">
            Ya puede acceder al sistema con las credenciales proporcionadas.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="success" 
            onClick={handleSuccessModalClose}
            className="px-4"
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
