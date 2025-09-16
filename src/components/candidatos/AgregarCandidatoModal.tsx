import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

interface Aprendiz {
  idaprendiz: number;
interface Candidato {
  idcandidatos: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  email: string;
  propuesta: string;
  numero_tarjeton: string;
}

interface Eleccion {
  ideleccion: number;
  nombre: string;
}

interface AgregarCandidatoModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (candidato: any) => void;
  // candidatos: Candidato[];
  elecciones: Eleccion[];
  aprendices: Aprendiz[];
  onSave: (data: FormData) => void;
  loading?: boolean;
  candidato?: Candidato;
}

const AgregarCandidatoModal = ({ show, onHide, onSave, aprendices, elecciones }: AgregarCandidatoModalProps) => {
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
    ideleccion: null,
    propuesta: "",
    numero_tarjeton: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>(""); // para previsualizar


  const aprendizOptions = Array.isArray(aprendices)
    ? aprendices.map((a) => ({
      value: a.idaprendiz,
      label: `${a.nombres} ${a.apellidos}`,
    }))
    : [];


  const eleccionOptions = Array.isArray(elecciones)
    ? elecciones.map((e) => ({
      value: e.ideleccion,
      label: e.nombre,
    }))
    : [];
const AgregarCandidatoModal = ({ 
  show, 
  onHide, 
  onSave, 
  loading = false,
  candidato 
}: AgregarCandidatoModalProps) => {
  const [formData, setFormData] = useState({
    nombres: candidato?.nombres || '',
    apellidos: candidato?.apellidos || '',
    email: candidato?.email || '',
    propuesta: candidato?.propuesta || '',
    numero_tarjeton: candidato?.numero_tarjeton || '',
    foto: null as File | null
  });

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
        idaprendiz: selected.value
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
      setFormData(prev => ({ ...prev, foto: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataToSend.append(key, value as string | Blob);
      }
    });
    
    onSave(formDataToSend);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{candidato ? 'Editar Candidato' : 'Nuevo Candidato'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Foto</Form.Label>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Nombres</Form.Label>
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
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />
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

              <Form.Group className="mb-3">
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
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Propuesta</Form.Label>
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

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Número de Tarjetón</Form.Label>
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
                <Form.Label>Foto {!candidato && '(Opcional)'}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AgregarCandidatoModal;