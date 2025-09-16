import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { FaBookOpen, FaRegSave, FaRegUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/auth.context";

export interface ProgramaFormacion {
  idprogramaFormacion: number;
  idnivelFormacion: number;
  idareaTematica: number;
  programa: string;
  codigoPrograma: string;
  version: string;
  duracion: number;
}

export interface CentroFormacion {
  idcentroFormacion: number;
  idregional: number;
  centroFormacioncol: string;
  idmunicipios: number;
  direccion: string;
  telefono: string;
  correo: string;
  subdirector: string;
  correosubdirector: string;
}

const AprendizForm = () => {
  const location = useLocation();
  const aprendiz = location.state?.aprendiz;
  const navigate = useNavigate();
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [programas, setProgramas] = useState<ProgramaFormacion[]>([]);
  const {user} = useAuth();

const getCentros = async () => {
  try {
    const res = await api.get("api/centrosFormacion/obtiene");
    setCentros(res.data.data || []);
  } catch (err) {
    toast.error("Error cargando centros");
    setCentros([]);
  }
};

const getProgramas = async () => {
  try {
    const res = await api.get("api/programasFormacion/listar");
    setProgramas(res.data || []);
  } catch (err) {
    toast.error("Error cargando programas");
    setProgramas([]);
  }
};

  useEffect(() => {
    if (!user?.centroFormacion) {
      console.log("Usuario o CentroFormacion no disponible");
      return;
    }
    getCentros();
    getProgramas();
  }, []);

  const { register, handleSubmit } = useForm({
    defaultValues: aprendiz
      ? {
          // EDITAR
          idaprendiz: aprendiz.idaprendiz ?? 0,
          idgrupo: aprendiz.idgrupo ?? 0,
          idprograma_formacion: aprendiz.idprogramaFormacion ?? 0,
          perfil_idperfil: aprendiz.perfilIdPerfil ?? 3,
          nombres: aprendiz.nombres ?? "",
          apellidos: aprendiz.apellidos ?? "",
          celular: aprendiz.celular ?? "",
          estado: aprendiz.estado ?? "activo",
          tipo_documento: aprendiz.tipoDocumento ?? "",
          centro_formacion_idcentro_formacion:
            aprendiz.centroFormacionIdcentroFormacion ?? 0,
          numero_documento: aprendiz.numeroDocumento ?? "",
          email: aprendiz.email ?? "",
          password: "",
        }
      : {
          // CREAR
          grupo: "",
          jornada: "",
          programa: "",
          codigo_programa: "", //
          version: "", //
          duracion: "", //
          idnivel_formacion: 0, //
          nivel_formacion: "", //
          idarea_tematica: 0, //
          perfil_idperfil: 3,
          nombres: "",
          apellidos: "",
          celular: "",
          estado: "activo",
          tipo_documento: "",
          centro_formacion_idcentro_formacion: user?.centroFormacion,
          numero_documento: "",
          email: "",
          password: "",
        },
  });

  const agregarAprendiz = async (data: any) => {
    if (!data.password) delete data.password;
    try {
      const res = await api.post("/api/aprendiz/crear", data);
      toast.success(res.data.message, { id: "toast" });
      navigate("/aprendices");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear aprendiz", {
        id: "toast",
      });
    }
  };

  const actualizarAprendiz = async (data: any) => {
    if (!data.password) delete data.password;
    try {
      const res = await api.put(
        `/api/aprendiz/actualizar/${data.idaprendiz}`,
        data
      );
      toast.success(res.data.message, { id: "toast" });
      navigate("/aprendices");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al actualizar el aprendiz",
        {
          id: "toast",
        }
      );
    }
  };
  const onSubmit = (data: any) => {
    if (data.programa) {
    const programaObj = JSON.parse(data.programa);

    data.idprograma_formacion = programaObj.idprogramaFormacion;
    data.codigo_programa = programaObj.codigoPrograma;
    data.version = programaObj.version;
    data.duracion = programaObj.duracion;
    data.idnivel_formacion = programaObj.idnivelFormacion;
    data.idarea_tematica = programaObj.idareaTematica;
    data.programa =  programaObj.programa; 
  }
    if (aprendiz) {
      actualizarAprendiz(data);
    } else {
      agregarAprendiz(data);
    }
  };

  return (
    <>
      <Card.Header
        className="px-4"
      >
        <h2 className="fw-bold">{aprendiz ? "Actualizar " : "Crear nuevo "}<span style={{color:'#6a11cb'}}>Aprendiz</span></h2>
        <p>{!aprendiz? 'Registra un nuevo ' : 'Actualiza un'} aprendiz en el sistema para habilitar su participación en los procesos en votación.</p>
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          {!aprendiz ? (
            <>
              <h4 className="mt-3" style={{color:'#6a11cb'}}>
                <FaBookOpen className="mx-2 mb-1" />
                Datos Estudiantiles
              </h4>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Grupo</Form.Label>
                    <Form.Control
                      {...register("grupo")}
                      placeholder="Grupo - ficha"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Jornada</Form.Label>
                    <Form.Select {...register("jornada")} required>
                      <option value="">Seleccione...</option>
                      <option value="Diurna">Diurna</option>
                      <option value="Noche">Noche</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Programa de Formación</Form.Label>
                    <Form.Select {...register("programa")} required>
                      <option value="">Seleccione...</option>
                      {programas.map((p) => (
                        <option
                          key={p.idprogramaFormacion}
                          value={JSON.stringify(p)}
                        >
                          {p.programa}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {user?.perfil == "Administrador"?
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Centro Formación</Form.Label>
                    <Form.Select
                      {...register("centro_formacion_idcentro_formacion")} required
                      >
                      <option value={0}>Seleccione...</option>
                      {centros.map((c) => (
                        <option value={c.idcentroFormacion}>
                          {c.centroFormacioncol}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>:<></>
                }
              </Row>
            </>
          ) : (
            <></>
          )}
          <h4 className="mt-4" style={{color:'#6a11cb'}}>
            <FaRegUser className="mx-2 mb-1" />
            Datos Personales
          </h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombres</Form.Label>
                <Form.Control {...register("nombres")} required placeholder="Nombres" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  {...register("apellidos")}
                  placeholder="Apellidos"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo Documento</Form.Label>
                <Form.Select {...register("tipo_documento")} required>
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
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Celular</Form.Label>
                <Form.Control {...register("celular")} placeholder="Celular"/>
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
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password", {required: !aprendiz})}
                  placeholder="Contraseña"
                  required={!aprendiz}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-center mt-4 btn">
            <Button
              type="submit"
              size="lg"
              className="px-4 mt-4"
              style={{
                backgroundColor: "#6a11cb",
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