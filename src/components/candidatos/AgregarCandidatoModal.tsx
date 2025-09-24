import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select"
import { api } from "../../api";
import toast from "react-hot-toast";

interface Aprendiz {
  idaprendiz: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  email: string;
}

interface AgregarCandidatoModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (candidato: any) => void;
  // elecciones: Eleccion[];
  aprendices: Aprendiz[];
  idEleccion?: number;
}

const AgregarCandidatoModal = ({ show, onHide, onSave, idEleccion, aprendices }: AgregarCandidatoModalProps) => {
  const [formData, setFormData] = useState<{
    nombres: string;
    foto: File | string | null;
    idaprendiz: number | null;
    ideleccion: number | null;
    propuesta: string;
    numero_tarjeton: string;
  }>({
    nombres: "",
    foto: null as File | null,
    idaprendiz: null,
    ideleccion: idEleccion || null,
    propuesta: "",
    numero_tarjeton: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const aprendizOptions = Array.isArray(aprendices)
    ? aprendices.map((a, index) => ({
      id: index,
      value: a.idaprendiz,
      label: `${a.nombres} ${a.apellidos}`.trim(),
    }))
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "ideleccion" ? Number(value) : value,
    }));
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
      toast.success(response.data.message, { id: "toast" });

      if (onSave) {
        onSave({
          ...response.data,
          programa: response.data.aprendiz?.programa?.programa ?? "",
        });
      }

      onHide();
    } catch (error: any) {
      console.error("Error al crear candidato:", error.response?.data || error.message);
      toast.error("Error al guardar candidato");
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
              <Form.Group className="mb-3">
                <Form.Label>Foto</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];

                      // Guardar el File en formData
                      setFormData((prev) => ({
                        ...prev,
                        foto: file,
                      }));

                      // Crear la URL para previsualizar
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {previewUrl && (
                  <div className="mt-3 text-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="rounded-circle"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </Form.Group>


            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Select
                  options={aprendizOptions}
                  placeholder="Buscar aprendiz..."
                  value={
                    formData.idaprendiz
                      ? aprendizOptions.find((opt) => opt.value === formData.idaprendiz)
                      : null
                  }
                  onChange={handleSelectChange}
                  isClearable
                />
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>Elección</Form.Label>
                <Select
                  options={eleccionOptions}
                  placeholder="Selecciona una opción..."
                  value={
                    formData.ideleccion
                      ? eleccionOptions.find((opt) => opt.value === formData.ideleccion)
                      : null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      ideleccion: selected ? selected.value : null,
                    })
                  }
                  isClearable
                />
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label>Propuesta</Form.Label>
                <Form.Control
                  as="textarea"
                  name="propuesta"
                  value={formData.propuesta}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Breve descripción del candidato y sus propuestas"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Número de Tarjetón</Form.Label>
                <Form.Control
                  type="text"
                  name="numero_tarjeton"
                  value={formData.numero_tarjeton}
                  onChange={handleChange}
                  placeholder="Número de Tarjetón"
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