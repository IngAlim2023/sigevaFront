import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {api} from "../api"
import Logo from "../assets/Sigeva logo.svg"

export default function Login(){
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const navigate=useNavigate()

    const submit=async (e:React.FormEvent)=>{
        e.preventDefault()
        try{
            api.post("/auth/login",{
                email,password
            })
        }catch{

        }
    }
    return(
            <div className="d-flex justify-content-center align-items-center vh-100 bg-primary "  style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
                <Container style={{ maxWidth: "450px", minHeight: "480px" }} className="bg-white p-5 rounded shadow">
                    <Form>  

                        <h3 className="text-center mb-3 fw-bold" >Bienvenido a</h3>
                        <div className="text-center mb-4">
                            <img src={`${Logo}`}  alt="Logo" height="50px"  />
                        </div>
                        
                        <p className="text-center" >Sistema de Gestión de Votos para Aprendices</p>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Correo electrónico</strong> </Form.Label>
                            <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese su correo electrónico "/>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label><strong>Contraseña</strong> </Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingrese su número de documento" />
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Ingresar</Button>
                        </Form.Group>
                        


                    </Form>
                </Container>
            </div>
    )
}