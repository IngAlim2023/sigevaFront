import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useAuth } from "../../context/auth/auth.context";
import Swal from "sweetalert2"

interface Props {
    show: boolean;
    onHide: () => void;
    candidato: {
        nombre: string;
        programa: string;
        propuesta: string;
        foto: string;
        numeroTarjeton: string;
        idCandidato: string;
    } | null;
}

export default function SelecionarCandidato({ show, onHide, candidato }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [shotModal, setShowModal] = useState(false);
    const [otp, setOtp] = useState("");
    const { user } = useAuth();

    if (!candidato) return null;

    /**
     * generar OTP en servidor
     * devuelve true si se generó correctamente, false en caso contrario
     */
    const enviarOTP = async () => {
        console.log("[enviarOTP] iniciando. user:", user, "eleccionId(param):", id);
        try {
            const payload = {
                aprendiz_idaprendiz: user?.id,
                elecciones_ideleccion: id
            };
            console.log("[enviarOTP] payload:", payload);

            const response = await api.post('/api/validaciones/generarOtp', payload);
            console.log("[enviarOTP] respuesta del servidor:", response);
            // si tu backend devuelve algo útil, lo verás en response.data
            console.log("[enviarOTP] response.data:", response.data);

            // devuelve true para indicar éxito (ajusta según tu API)
            return true;
        } catch (error: any) {
            // intentamos extraer info útil del error
            console.error("[enviarOTP] error al generar OTP:", error);
            console.error("[enviarOTP] error.message:", error?.message);
            console.error("[enviarOTP] error.response?.status:", error?.response?.status);
            console.error("[enviarOTP] error.response?.data:", error?.response?.data);

            // muestra Swal con más detalles si están disponibles
            const serverMsg = error?.response?.data?.message || error?.response?.data || error?.message;
            Swal.fire({
                title: "No se pudo enviar OTP",
                text: String(serverMsg),
                icon: "error",
                confirmButtonText: "Ok"
            });

            return false;
        }
    }

    /**
     * manejador que espera a que enviarOTP termine antes de abrir modal
     */
    const handleVoteClick = async () => {
        // cerramos modal candidato primero (como tenías)
        onHide();
        // llamamos y esperamos
        const ok = await enviarOTP();
        console.log("[handleVoteClick] enviarOTP ok?:", ok);
        if (ok) {
            setShowModal(true);
        } else {
            // si falló, opcionalmente podrías reabrir el modal o navegar
            // navigate("/votaciones");
        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[submit] OTP ingresado:", otp);

        if (!/^\d{6}$/.test(otp)) {
            console.log("[submit] OTP inválido, no es 6 dígitos numéricos");
            return Swal.fire({
                title: "Tu código OTP debe tener 6 dígitos numéricos",
                icon: "error",
                confirmButtonText: "Intentar de nuevo"
            });
        }

        try {
            console.log("[submit] validando OTP en backend...");
            const { data } = await api.post('api/validaciones/validarOtp', {
                codigo_otp: otp
            });
            console.log("[submit] respuesta validarOtp:", data);

            if (data.success === true) {
                try {
                    console.log("[submit] registrando voto. candidatoId:", candidato.idCandidato, "aprendiz:", user.id, "eleccionId:", id);
                    const { data: votoResp } = await api.post('/api/votoXCandidato/crear/', {
                        idcandidatos: Number(candidato.idCandidato),
                        idaprendiz: Number(user.id),
                        contador: 1,
                        ideleccion: Number(id)
                    });

                    console.log("[submit] respuesta crear voto:", votoResp);

                    if (votoResp.mensaje === "Éxito") {
                        Swal.fire({
                            title: "Tu voto fue registrado con éxito",
                            icon: "success",
                            confirmButtonText: "Volver"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate("/votaciones")
                            }
                        })
                    } else {
                        Swal.fire({
                            title: "Error. Ya votaste, no puedes volver a votar.",
                            icon: "error",
                            confirmButtonText: "Intentar de nuevo"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate("/votaciones")
                            }
                        })
                    }
                } catch (error: any) {
                    console.error("[submit] error al crear voto:", error);
                    console.error("[submit] error.response?.data:", error?.response?.data);
                    Swal.fire({
                        title: "Tu Voto No Fue Registrado, Intenta nuevamente",
                        text: String(error?.response?.data || error?.message),
                        icon: "error",
                        confirmButtonText: "Intentar de nuevo"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/votaciones")
                        }
                    })
                }
            } else {
                console.warn("[submit] validarOtp devolvió success !== true:", data);
                Swal.fire({
                    title: "Código OTP Incorrecto, Intenta nuevamente",
                    icon: "error",
                    confirmButtonText: "Intentar de nuevo"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/votaciones")
                    }
                })
            }
        } catch (error: any) {
            console.error("[submit] error al validar OTP:", error);
            console.error("[submit] error.response?.data:", error?.response?.data);
            Swal.fire({
                title: "Código OTP Incorrecto, Intenta nuevamente",
                text: String(error?.response?.data || error?.message),
                icon: "error",
                confirmButtonText: "Intentar de nuevo"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/votaciones")
                }
            })
        }
    }

    return (
        <Container>

            <Modal show={show} onHide={onHide} centered size="lg" >
                <Modal.Header>

                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        {/* Columna de la imagen */}
                        <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                            <img src={candidato.foto} alt="foto" className="img-fluid rounded"
                                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#f5f5f5", borderRadius: "10px" }} />
                        </Col>

                        {/* Columna de la información */}
                        <Col xs={12} md={8}>
                            <Row className="align-items-center mb-2">
                                <Col>
                                    <h4 className="fw-bold m-0">{candidato.nombre}</h4>
                                </Col>
                                <Col xs="auto">
                                    <h5 className="text-success fw-bold">{candidato.numeroTarjeton}</h5>
                                </Col>
                            </Row>

                            <p style={{ textAlign: "justify" }}>
                                {candidato.propuesta}
                            </p>
                        </Col>
                    </Row>
                    <Container className="d-flex justify-content-between gap-3 mt-4">
                        <Button variant="danger" onClick={onHide}>Cancelar</Button>
                        {/* ahora usamos handleVoteClick que espera a enviarOTP */}
                        <Button variant="success" onClick={handleVoteClick}>Votar por este candidato</Button>
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal show={shotModal} centered dialogClassName="modal-compact">
                <Modal.Header closeButton onClick={() => { setShowModal(false); setOtp(""); }}>
                </Modal.Header>
                <Modal.Body className="bg-white p-5 rounded" style={{ maxWidth: "450px", margin: "0 auto" }}>
                    <h1 className="fw-bold text-center">Confirmar Voto</h1>
                    <p className="text-center">Ingresa el código de 6 dígitos enviado a tu correo.</p>

                    <Form onSubmit={submit}>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={6}
                                placeholder=" - - - - - - "
                                className="text-center border-success"
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Button type="submit" className="w-100">
                                Confirmar Voto
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>

        </Container>
    )
}
