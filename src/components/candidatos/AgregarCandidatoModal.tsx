import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { FiUpload } from "react-icons/fi";
import Select from "react-select"
import axios from "axios";

interface Programa {
  idprogramaFormacion: number;
  idnivelFormacion: number;
  idareaTematica: number;
  programa: string;
  codigoPrograma: string;
  version: string;
  duracion: number;
}

interface Candidato {
  idcandidato: number;
  nombres: string;
  apellidos: string;
  programa: Programa;
  email: string;
}
interface Eleccion {
  ideleccion: number;
  nombre: string;
}
interface AgregarCandidatoModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (candidato: any) => void;
  candidatos: Candidato[];
  elecciones: Eleccion[];
}

const VITE_URL_BACK = import.meta.env.VITE_BASE_URL;

// const VITE_URL_BACK = import.meta.env.VITE_BASE_URL;

const AgregarCandidatoModal = ({ show, onHide, onSave, candidatos, elecciones }: AgregarCandidatoModalProps) => {
  const [formData, setFormData] = useState<{
    nombres: string;
    programa: string;
    descripcion: string;
    foto: File | string | null;
    idcandidato: number | null;
    ideleccion: number | null;
    propuesta: string;
    numero_tarjeton: string;
  }>({
    nombres: "",
    programa: "",
    descripcion: "",
    foto: null as File | null,
    idcandidato: null,
    ideleccion: null,
    propuesta: "",
    numero_tarjeton: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>(""); // para previsualizar


  const aprendizOptions = candidatos.map((a) => ({
    value: a.idcandidato,
    label: `${a.nombres} ${a.apellidos}`,
  }));

  // const eleccionOptions = Array.isArray(elecciones)
  //   ? elecciones.map((e) => ({
  //     value: e.ideleccion,
  //     label: e.nombre,
  //   }))
  //   : [];



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
      data.append("idcandidato", String(formData.idcandidato));
      data.append("propuesta", formData.propuesta);
      data.append("numero_tarjeton", String(formData.numero_tarjeton));

      if (formData.foto instanceof File) {
        data.append("foto", formData.foto);
      }

      const response = await axios.post(
        `${VITE_URL_BACK}/api/candidatos/crear`,

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
      setFormData({
        ...formData,
        nombres: selected.label,
        idcandidato: selected.value
        // ideleccion: selected.value,
      });
    } else {
      setFormData({
        ...formData,
        nombres: "",
        idcandidato: null,
        // ideleccion: null,
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
              {/* <div className="text-center mb-3">
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
              </div> */}
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

                {/* Preview */}
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
                    formData.idcandidato
                      ? aprendizOptions.find((opt) => opt.value === formData.idcandidato)
                      : null
                  }
                  onChange={handleSelectChange}
                  isClearable
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Elección</Form.Label>
                <Select
                  options={[
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                  ]}
                  placeholder="Selecciona una opción..."
                  value={
                    formData.ideleccion !== null && formData.ideleccion !== undefined
                      ? { value: formData.ideleccion, label: String(formData.ideleccion) }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      ideleccion: selected ? selected.value : null, // guarda el número
                    })
                  }
                  isClearable
                />
              </Form.Group>

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