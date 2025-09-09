import { Badge } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
export default function CargarAprendices(){


    return(
        <div >
            <Container className="mb-5">
                <h1>Cargar Archivos De Votantes</h1>
                <p>Seleccione un archivo Excel (.xlsx) con los datos de los aprendices. Asegúrese de que el archivo cumpla con las siguientes columnas:</p>
            </Container>

            <Container className="mb-5"> 
                <Form.Control type="file" />
            </Container>

            <Container>
                <div>
                    <h2>Vista Previa De los Datos</h2>
                </div>

                <div>
                    <Table  className="align-middle"> 
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Documento</th>
                                    <th>Correo</th>
                                    <th>Programa</th>
                                    <th>Jornada</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Camilo H</td>
                                    <td>940385</td>
                                    <td>camH@gmail.com</td>
                                    <td>Desarrollo de software</td>
                                    <td>Tardé</td>
                                    <td><Badge bg="success" pill>Activo</Badge> </td>
                                </tr>
                            </tbody>
                    </Table>
                </div>
            </Container>

            <Container className="d-flex justify-content-end">
                <Button variant="primary">Subir Archivos y Procesar</Button>
            </Container>
        </div>
    )
}