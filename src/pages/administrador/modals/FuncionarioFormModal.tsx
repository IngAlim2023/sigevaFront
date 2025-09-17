import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../../api";
import Select from "react-select";
import { useForm } from "react-hook-form";

interface FuncionarioFormModalProps {
  show: boolean;
  onHide: () => void;
  isEditing: boolean;
  error?: string;
  loading?: boolean;
}

export const FuncionarioFormModal: React.FC<FuncionarioFormModalProps> = ({
  show,
  onHide,
  isEditing,
  error,
  loading = false,
}) => {
  const [regionales, setRegionales] = useState<any[]>([]);
  const [centros, setCentros] = useState<any[]>([]);
  const [idRegional, setIdRegional] = useState<number>(0);
  const [idCentroFormacion, setIdCentroFormacion] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Traer regionales al abrir modal
  useEffect(() => {
    api.get("/api/regionales").then((res) => setRegionales(res.data));
  }, []);

  // Traer centros cuando se seleccione un regional
  useEffect(() => {
    if (!idRegional) return;
    api
      .get(`/api/centrosFormacion/obtiene/porRegional/${idRegional}`)
      .then((res) => setCentros(res.data.data));
  }, [idRegional]);

  // Generar opciones para react-select
  const optionsRegionales = regionales.map((r) => ({
    value: r.idregional,
    label: r.regional,
  }));

  const optionsCentros = centros.map((c) => ({
    value: c.idcentroFormacion,
    label: c.centroFormacioncol,
  }));

  const onSubmit = async (data: any) => {
    if (!idCentroFormacion) {
      return alert("Selecciona un centro de formación");
    }

    const submissionData = {
      ...data,
      idcentro_formacion: idCentroFormacion,
    };

    try {
      await api.post("/api/usuarios/crear", submissionData);
      setIdCentroFormacion(0);
      onHide();
    } catch {
      alert("No se logró crear el usuario");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Editar Funcionario" : "Nuevo Funcionario"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            {/* Correo */}
            <Form.Group className="col-md-6">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingrese un correo válido",
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message as string}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Contraseña (solo al crear) */}
            {!isEditing && (
              <Form.Group className="col-md-6">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password", {
                    required: "La contraseña es requerida",
                  })}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {/* Select Regional */}
            <div className="col-md-6">
              <Form.Label>Regional</Form.Label>
              <Select
                options={optionsRegionales}
                placeholder="Busca o selecciona una regional..."
                isSearchable
                isClearable
                onChange={(option) => setIdRegional(option ? option.value : 0)}
              />
            </div>

            {/* Select Centro */}
            <div className="col-md-6">
              <Form.Label>Centro de Formación</Form.Label>
              <Select
                options={optionsCentros}
                placeholder="Busca o selecciona un centro..."
                isSearchable
                isClearable
                onChange={(option) =>
                  setIdCentroFormacion(option ? option.value : 0)
                }
              />
            </div>

            {/* Estado */}
            <Form.Group className="col-md-6">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                {...register("estado", { required: "Seleccione un estado" })}
                isInvalid={!!errors.estado}
              >
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.estado?.message as string}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Perfil */}
            <Form.Group className="col-md-6">
              <Form.Label>Perfil</Form.Label>
              <Form.Select
                {...register("idperfil", { required: "Seleccione un perfil" })}
                isInvalid={!!errors.idperfil}
              >
                <option value="">Seleccione un perfil</option>
                <option value="2">Funcionario</option>
                <option value="1">Administrador</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.idperfil?.message as string}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
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
