import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../../api";
import Select from "react-select";
import { useForm } from "react-hook-form";

interface FuncionarioFormModalProps {
  show: boolean;
  onHide: () => void;
  formData: {
    email: string;
    estado: string;
    perfil: string;
    password?: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditing: boolean;
  error?: string;
  loading?: boolean;
}

export const FuncionarioFormModal: React.FC<FuncionarioFormModalProps> = ({
  show,
  onHide,
  formData,
  isEditing,
  error,
  loading = false,
}) => {
  const [regionales, setRegionales] = useState<any>([]);
  const [centros, setCentros] = useState<any>([]);
  const [idcentro_formacion, setIdcentro_formacion] = useState<any>(0);
  const [idRegional, setIdRegional] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadData = async () => {
      const regio = await api.get(
        "https://sigevaback-real.onrender.com/api/regionales"
      );
      setRegionales(regio.data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const centrosF = await api.get(
        `https://sigevaback-real.onrender.com/api/centrosFormacion/obtiene/porRegional/${idRegional}`
      );
      setCentros(centrosF.data.data);
    };
    loadData();
  }, [idRegional]);

  const options = regionales.map((value: any) => ({
    value: value.idregional,
    label: value.regional,
  }));

  const optionsCentro = centros.map((value: any) => ({
    value: value.idcentroFormacion,
    label: value.centroFormacioncol,
  }));

  const onSubmit = async (data: any) => {
  const submissionData = {
    ...data,
    idcentro_formacion
  };
  if(idcentro_formacion=== 0){
    return alert('Selecciona un centro de formacion')
  }
  try{
    const res = await api.post('/api/usuarios/crear', submissionData);
    setIdcentro_formacion(0);
  }catch(e){
    alert('No se logro crear el usuario')
  }
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
            {isEditing ? "Editar Funcionario" : "Nuevo Funcionario"}
          </Modal.Title>
          <p className="text-muted mb-0">
            {isEditing
              ? "Actualiza la información del funcionario"
              : "Registra un nuevo funcionario en el sistema."}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="row g-3">
            <Form.Group className="col-md-6" controlId="email">
              <Form.Label>
                Correo Electrónico <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                {...register("email", {
                  required: "El correo electrónico es requerido", // Custom error message
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingrese un correo electrónico válido", // Custom pattern error
                  },
                })}
                isInvalid={!!errors.email} // Show invalid state if error exists
              />
              <Form.Control.Feedback type="invalid">
                {!formData.email
                  ? "El correo electrónico es requerido"
                  : "Ingrese un correo electrónico válido"}
              </Form.Control.Feedback>
            </Form.Group>

            {!isEditing && (
              <Form.Group className="col-md-6" controlId="password">
                <Form.Label>
                  Contraseña <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="password"
                  {...register("password", {
                    required: true,
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {!formData.password
                    ? "La contraseña es requerida"
                    : "La contraseña debe tener al menos 8 caracteres"}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Select
              options={options}
              onChange={(e: any) => setIdRegional(e?.value)}
            />
            <Select options={optionsCentro} onChange={(e: any) => setIdcentro_formacion(e?.value)} />

            <Form.Group className="col-md-6" controlId="estado">
              <Form.Label>
                Estado <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("estado", {
                  required: "Seleccione un estado",
                })}
                isInvalid={!!errors.estado} // ✅ Uses react-hook-form's errors
                defaultValue={formData.estado || ""} // ✅ Handles editing mode
              >
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="col-md-6" controlId="perfil">
              <Form.Label>
                Perfil <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("idperfil", {
                  required: "Seleccione un perfil",
                  validate: (value) => value !== "" || "Seleccione un perfil",
                })}
                isInvalid={!!errors.perfil}
                defaultValue={formData.perfil || ""}
              >
                <option value="">Seleccione un perfil</option>
                <option value="2">Funcionario</option>
                <option value="1">Administrador</option>
              </Form.Select>
              
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
            <Button variant="primary" type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : isEditing
                ? "Guardar cambios"
                : "Crear funcionario"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
