import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { FaRegSave, FaRegUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const AprendizForm = () => {
  const location = useLocation();
  const aprendiz = location.state?.aprendiz;
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: aprendiz
      ? {
          //EDITAR
          idgrupo: aprendiz.idgrupo ?? 0,
          idprograma_formacion: aprendiz.idprogramaFormacion ?? 0,
          perfil_idperfil: aprendiz.perfilIdPerfil ?? 3,
          nombres: aprendiz.nombres ?? "",
          apellidos: aprendiz.apellidos ?? "",
          celular: aprendiz.celular ?? "",
          tipo_documento: aprendiz.tipoDocumento ?? "",
          centro_formacion_idcentro_formacion:
            aprendiz.centroFormacionIdcentroFormacion ?? 0,
          numero_documento: aprendiz.numeroDocumento ?? "",
          email: aprendiz.email ?? "",
          password: aprendiz.password ?? "",
        }
      : {
          //CREAR
          idgrupo: "",
          idprograma_formacion: "",
          perfil_idperfil: 3,
          nombres: "",
          apellidos: "",
          celular: "",
          tipo_documento: "",
          centro_formacion_idcentro_formacion: 0,
          numero_documento: "",
          email: "",
          password: "",
        },
  });

  const agregarAprendiz = async (data: any) => {
    try {
      const res = await api.post("/api/aprendiz/crear", data);
      navigate("/");
      return res.data.message;
    } catch (error: any) {
      toast.error("Error al Agregar el Aprendiz", { id: "toast" });
      console.error("Error en agregarAprendiz", error);
    }
  };

  const actualizarAprendiz = async (data: any) => {
    try {
      const res = await api.put(
        `/api/aprendiz/actualizar/${data.idaprendiz}`,
        data
      );
      navigate("/");
      return res.data.message;
    } catch (error: any) {
      toast.error("Error al Actualizar el Aprendiz", { id: "toast" });
      console.error("Error en actualizarAprendiz", error);
    }
  };

  const onSubmit = (data: any) => {
    if (aprendiz) {
      actualizarAprendiz(data);
    } else {
      agregarAprendiz(data);
    }
  };

  return (
    <>
      <Card.Header
        className="text-white text-center fs-4 fw-bold"
        style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}
      >
        {aprendiz ? "Actualizar Aprendiz" : "Agregar Aprendiz"}
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-3 text-primary">
            <FaRegUser className="mx-2" />
            Datos Personales
          </h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombres</Form.Label>
                <Form.Control {...register("nombres")} placeholder="Nombres" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  {...register("apellidos")}
                  placeholder="Apellidos"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo Documento</Form.Label>
                <Form.Select {...register("tipo_documento")}>
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta Identidad</option>
                  <option value="CE">Cédula Extranjería</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Número Documento</Form.Label>
                <Form.Control
                  {...register("numero_documento")}
                  placeholder="Documento"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Celular</Form.Label>
                <Form.Control {...register("celular")} placeholder="Celular" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Correo Electronico</Form.Label>
                <Form.Control
                  type="email"
                  {...register("email")}
                  placeholder="Correo electronico"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Centro Formación</Form.Label>
                <Form.Select
                  {...register("centro_formacion_idcentro_formacion")}
                >
                  <option value={0}>Seleccione...</option>
                  <option value={1}>
                    Centro de teleinformatica y produccion industrial
                  </option>
                  <option value={2}>Centro de comercio y servicios</option>
                  <option value={3}>Centro santander de quilichado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Programa de Formación</Form.Label>
                <Form.Select
                  {...register("idprograma_formacion")}
                >
                  <option value={0}>Seleccione...</option>
                  <option value={1}>Diseño grafico</option>
                  <option value={2}>Desarrollo de software</option>
                  <option value={3}>Administracion de empresas</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password")}
                  placeholder="Contraseña"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-center mt-4 btn">
            <Button
              type="submit"
              size="lg"
              className="px-4"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              }}
            >
              <FaRegSave className="mx-2 mb-1" />
              Guardar
            </Button>
          </div>
        </Form>
      </Card.Body>
      <Toaster />
    </>
  );
};

export default AprendizForm;
