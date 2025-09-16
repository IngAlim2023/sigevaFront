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

    const navigate=useNavigate();
    
    const [shotModal, setShowModal] = useState(false);
    const [otp, setOtp] = useState("");
    const { user } = useAuth();

    if (!candidato) return null;

    const enviarOTP = async () => {

        try {
            await api.post('/api/validaciones/generarOtp', {
                aprendiz_idaprendiz: user.id,
                elecciones_ideleccion: id
            }
            )
        } catch (error) {


        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (otp.length === 0 || otp.length > 6) return alert("El código OTP debe tener 6 dígitos");
            const { data } = await api.post('api/validaciones/validarOtp', {
                codigo_otp: otp
            })
            if (data.success === true) {
                try {
                    
                    const {data}=await api.post('/api/votoXCandidato/crear/', {
                        idcandidatos: Number(candidato.idCandidato),
                        idaprendiz: Number(user.id),
                        contador: 1,
                        ideleccion: id
                    });
                    if(data.success===true){
                        Swal.fire({
                            title:"Tu Voto Fue Registrado Con Éxito",
                            icon: "success",
                            draggable: true,
                            showConfirmButton:true,
                            confirmButtonText:"Volver"
                        }).then((result)=>{
                            if(result.isConfirmed){
                                navigate("/votaciones")
                            }
                        })
                    }else{
                        Swal.fire({
                            title:"Tu Voto No Fue Registrado Con Éxito",
                            icon: "error",
                            draggable: true,
                            showConfirmButton:true,
                            confirmButtonText:"Intenta votar de nuevo"
                        }).then((result)=>{
                            if(result.isConfirmed){
                                navigate("/votaciones")
                            }
                        })
                    }

                    
                    
                } catch (error) {
                    Swal.fire({
                        title:"Tu Voto No Fue Registrado Con Éxito",
                        icon: "error",
                        draggable: true,
                        showConfirmButton:true,
                        confirmButtonText:"Intenta votar de nuevo"
                    }).then((result)=>{
                        if(result.isConfirmed){
                            navigate("/votaciones")
                        }
                        })

                }
            } else {
                alert("Código OTP inválido");
            }

        } catch (error) {
            alert("Error al validar el código OTP");
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

                            {/* <h6 className="text-muted">{candidato.programa}</h6> */}
                            <p style={{ textAlign: "justify" }}>
                                {candidato.propuesta}
                            </p>
                        </Col>
                    </Row>
                    <Container className="d-flex justify-content-between gap-3 mt-4">
                        <Button variant="danger" onClick={onHide}>Cancelar</Button>
                        <Button variant="success" onClick={() => { onHide(); enviarOTP(); setShowModal(true) }}>Votar por este candidato</Button>
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal show={shotModal}  centered dialogClassName="modal-compact">
                <Modal.Header closeButton onClick={() => setShowModal(false)}>
                </Modal.Header>
                <Modal.Body className="bg-white p-5 rounded" style={{ maxWidth: "450px", margin: "0 auto" }}>
                    <h1 className="fw-bold text-center">Confirmar Voto</h1>
                    <p className="text-center">Ingresa el código de 6 dígitos enviado a tu correo.</p>

                    <Form onSubmit={submit}>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
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