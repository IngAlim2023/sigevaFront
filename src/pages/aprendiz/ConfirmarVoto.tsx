import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
export default function ConfirmarVoto(){
    const navigate=useNavigate()
    const submit=async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            Swal.fire({
                title:"Tu Voto Fue Registrado Con Éxito",
                icon: "success",
                draggable: true,
                showConfirmButton:true,
                confirmButtonText:"Volver"
            }).then((result)=>{
                if(result.isConfirmed){
                    navigate("/")
                }
            })

            
        }catch{
            Swal.fire({
                title:"Tu Voto No Fue Registrado Con Éxito",
                icon: "error",
                draggable: true,
                showConfirmButton:true,
                confirmButtonText:"Intenta votar de nuevo"
            }).then((result)=>{
                if(result.isConfirmed){
                    navigate("/")
                }
            })
            
        }
        

    }
    return(
        <div className="d-flex justify-content-center align-items-center vh-100 ">

            <Container style={{ maxWidth: "450px" }} className="bg-white p-5 rounded shadow">
                <h1 className="fw-bold text-center" >Confirmar Voto</h1>
                <p className=" text-center">Ingresa el código de 6 dígitos enviado a tu correo.</p>
                <Form onSubmit={submit}>
                <Form.Group className="mb-4">
                    <Form.Control type="text" placeholder=" - - - - - - " className="text-center border-success" />
                </Form.Group>
                <Form.Group>
                    <Button type="submit" className="w-100">Confirmar Voto</Button>
                </Form.Group>
                </Form>

            </Container>
        </div>
    )
}


