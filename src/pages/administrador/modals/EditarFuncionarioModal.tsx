import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../../api";
import Select from "react-select";

interface EditarFuncionarioModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
  const [regionales, setRegionales] = useState<any[]>([]);
  const [centros, setCentros] = useState<any[]>([]);

  useEffect(() => {
    if (show) {
      api.get("/api/regionales").then((res) => setRegionales(res.data));
      if (formData?.idregional) {
        api
          .get(`/api/centrosFormacion/obtiene/porRegional/${formData.idregional}`)
          .then((res) => setCentros(res.data.data));
      }
    }
  }, [show, formData?.idregional]);

  const optionsRegionales = regionales.map((r) => ({
    value: r.idregional,
    label: r.regional,
  }));

  const optionsCentros = centros.map((c) => ({
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

            {/* nombres */}
            <Form.Group className="col-md-6">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={formData?.nombres || ""}
                onChange={onInputChange}
              />
            </Form.Group>
            {/* apellidos */}
            <Form.Group className="col-md-6">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                value={formData?.apellidos || ""}
                onChange={onInputChange}
              />
            </Form.Group>
            {/* apellidos */}
            <Form.Group className="col-md-6">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                name="celular"
                value={formData?.celular || ""}
                onChange={onInputChange}
              />
            </Form.Group>
            {/* apellidos */}
            <Form.Group className="col-md-6">
              <Form.Label>Numero documento</Form.Label>
              <Form.Control
                type="text"
                name="numero_documento"
                value={formData?.numero_documento || ""}
                onChange={onInputChange}
              />
            </Form.Group>
            {/* Email */}
            <Form.Group className="col-md-6">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={onInputChange}
              />
            </Form.Group>
             <Form.Group className="col-md-6">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData?.email || ""}
                onChange={onInputChange}
              />
            </Form.Group>

            {/* Regional */}
            <div className="col-md-6">
              <Form.Label>Regional</Form.Label>
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
            </div>

            {/* Centro */}
            <div className="col-md-6">
              <Form.Label>Centro de Formación</Form.Label>
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
            </div>

            {/* Estado */}
            <Form.Group className="col-md-6">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData?.estado || ""}
                onChange={onInputChange}
              >
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Form.Select>
            </Form.Group>

            {/* Perfil */}
            <Form.Group className="col-md-6">
              <Form.Label>Perfil</Form.Label>
              <Form.Select
                name="idperfil"
                value={formData?.idperfil || ""}
                onChange={onInputChange}
              >
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
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
