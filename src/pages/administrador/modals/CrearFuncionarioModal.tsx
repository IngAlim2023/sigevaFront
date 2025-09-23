import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../../api";
import Select from "react-select";
import { useForm } from "react-hook-form";

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
  const [regionales, setRegionales] = useState<any[]>([]);
  const [centros, setCentros] = useState<any[]>([]);
  const [idRegional, setIdRegional] = useState<number>(0);
  const [idCentroFormacion, setIdCentroFormacion] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (show) {
      api.get("/api/regionales").then((res) => setRegionales(res.data));
      reset({});
    }
  }, [show, reset]);

  useEffect(() => {
    if (!idRegional) return;
    api
      .get(`/api/centrosFormacion/obtiene/porRegional/${idRegional}`)
      .then((res) => setCentros(res.data.data));
  }, [idRegional]);

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

    const submissionData = { ...data, idcentro_formacion: idCentroFormacion };


    try {
      await api.post("/api/usuarios/crear", submissionData);
      setIdCentroFormacion(0);
      onHide();
    } catch (err) {
      alert("Error al crear el funcionario");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Funcionario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* Campos básicos */}
          <div className="row g-3">
            {/* <Form.Group className="col-md-6">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                {...register("nombre", { required: "El nombre es requerido" })}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Form.Group> */}

            {/* <Form.Group className="col-md-6">
              <Form.Label>Documento</Form.Label>
              <Form.Control
                type="text"
                {...register("documento", { required: "El documento es requerido" })}
                isInvalid={!!errors.documento}
              />
              <Form.Control.Feedback type="invalid">
                {errors.documento?.message}
              </Form.Control.Feedback>
            </Form.Group> */}

            <Form.Group className="col-md-6">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                {...register("nombres", { required: "Los nombres son requeridos" })}
                isInvalid={!!errors.nombres}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombres?.message}
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
                {errors.apellidos?.message}
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
                {errors.nombres?.message}
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
                {errors.numero_documento?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* <Form.Group className="col-md-6">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                {...register("telefono", { required: "El teléfono es requerido" })}
                isInvalid={!!errors.telefono}
              />
              <Form.Control.Feedback type="invalid">
                {errors.telefono?.message}
              </Form.Control.Feedback>
            </Form.Group> */}
            <Form.Group className="col-md-6">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                {...register("email", { required: "El correo es requerido" })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Contraseña (solo en crear) */}
            <Form.Group className="col-md-6">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                {...register("password", { required: "La contraseña es requerida" })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
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
  );
};
