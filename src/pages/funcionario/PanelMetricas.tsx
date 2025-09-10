import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function PanelMetricas(){

    return(
        <div>       
            <Container>
                <h1 className="fw-bold ">Panel de Métricas y Resultados</h1>
                <p className="text-primary">Elección de representante de Aprendices </p>
            </Container>

            <Container className="d-flex gap-3 mb-3">
                {/*RESUMEN GENERAL */}
                <div className="border rounded p-3 flex-fill w-75" >
                    
                    <div >
                        <h3 className="fw-bold mb-3">Resumen General</h3>
                    </div>
                    {/* parte 1 */}
                    <div className="d-flex justify-content-between mb-3">
                        <div >
                            <p className="text-primary fw-bold" >Aprendices Habilitados</p>
                            <p>500</p>
                        </div>
                        <div>
                            <p className="text-primary fw-bold">Votos Emitidos</p>
                            <p>450</p>
                        </div>
                        <div>
                            <p className="text-primary fw-bold" >Participación</p>
                            <p>90%</p>
                        </div>
                        <div>
                            <p className="text-primary fw-bold">Inicio</p>
                            <p>2025-07-21</p>
                        </div>
                    </div>    

                    {/* parte 2 */}

                    <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-primary fw-bold">Centro de formación</p>
                                <p>Centro de servicios Empresariales</p>
                            </div>
                            
                            <div>
                                <p className="text-primary fw-bold">Jornada</p>
                                <p>Mañana</p>
                            </div>

                            <div>
                                <p className="text-primary fw-bold">Cierre</p>
                                <p>2024-07-22</p>
                            </div>
                    </div>
                </div>

                {/* DISTRIBUCIÓN DE VOTOS */}
                <div className="border rounded p-3 flex-fill">
                    <div>
                        <h3 className="fw-bold">Distribución De Votos</h3>
                    </div>
                    <div>
                        <p >Sofia Ramirez</p>
                        <ProgressBar now={44.4} label={`44.4%`} className="mb-2"/>
                    </div>
                    <div>
                        <p>Carlos Mendoza</p>
                        <ProgressBar now={33.3} label={`33.3%`} className="mb-2"/>
                    </div>
                    <div>
                        <p>Laura García</p>
                        <ProgressBar now={22.2} label={`22.2%`} className="mb-2"/>
                    </div>
                </div>
            </Container>


            <Container className="mb-3" >
                <div className="flex-fill border rounded p-3 w-75">
                <h3>Resultados por Candidato</h3>

                <div  className="d-flex justify-content-start" >
                    <Table className="w-100">
                        <thead>
                            <tr>
                                <th>Candidato</th>
                                <th>Votos</th>
                                <th>Porcentaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sofia Ramirez</td>
                                <td className="text-primary fw-bold">200</td>
                                <td className="text-primary fw-bold">44.4%</td>
                            </tr>
                            <tr>
                                <td>Carlos Mendoza</td>
                                <td className="text-primary fw-bold">150</td>
                                <td className="text-primary fw-bold">33.3%</td>
                            </tr>
                            <tr>
                                <td>Laura García</td>
                                <td className="text-primary fw-bold">100</td>
                                <td className="text-primary fw-bold">22.2%</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                </div>
            </Container>

            <Container className="d-flex justify-content-end ">
                <Button variant="success">Exportar informe PDF</Button>
            </Container>

        </div>
    )
}