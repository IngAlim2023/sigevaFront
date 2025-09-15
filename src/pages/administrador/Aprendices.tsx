import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Badge,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { api } from "../../api";
import DataTable from "react-data-table-component";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export interface AprendizResponse {
  idaprendiz: number;
  idgrupo: number;
  idprogramaFormacion: number;
  perfilIdperfil: number;
  centroFormacionIdcentroFormacion: number;
  nombres: string;
  apellidos: string;
  celular: string;
  estado: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  centro_formacion:object;
  grupo:object;
}

interface TableRow {
  name: string;
  selector?: (row:any)=>string;
  sortable?:boolean;
  cell?: (row:any) => any;
}

const Aprendices: React.FC = () => {
  const navigate = useNavigate();
  const [buscar, setBuscar] = useState("");
  const [aprendices, setAprendices] = useState<AprendizResponse[]>([]);

  const getAprendices = async () => {
    const res = await api.get("api/aprendiz/listar");
    setAprendices(res.data);
  };

  useEffect(() => {
    getAprendices();
  }, []);

  const filteredData = aprendices.filter((a) =>
    [a.nombres, a.apellidos, a.numeroDocumento, a.email]
      .join(" ")
      .toLowerCase()
      .includes(buscar.toLowerCase())
  );

  const columns: TableRow[] = [
    {
      name: "Nombre",
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: "Apellidos",
      selector: (row) => row.apellidos,
      sortable: true,
    },
    {
      name: "Tipo Doc",
      selector: (row) => row.tipoDocumento,
    },
    {
      name: "Documento",
      selector: (row) => row.numeroDocumento,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.email,
    },
    {
      name: "Centro de formación",
      selector: (row) => row.centroFormacionIdcentroFormacion,
    },
    {
      name: "Celular",
      selector: (row) => row.celular,
    },
    {
      name: "Estado",
      cell: (row) => (
        <Badge bg={row.estado === "activo" ? "success" : "danger"}>
          {row.estado}
        </Badge>
      ),
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row) => (
        <>
        <Button variant="light" size="lg" onClick={()=>navigate('/aprendiz-form', {state:{aprendiz:row}})}>
          <FaEdit />
        </Button>
        </>
      )
    },
  ];

  const ExpandableComponent = ({ data }: { data: AprendizResponse }) => (
    <div className="p-3 bg-white small">
      <div className="row">
        <div className="col-md-6 mb-2">
          <strong>Nombre </strong> {data.nombres} {data.apellidos}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Programa de formación </strong> {data.idprogramaFormacion}
        </div>

        <div className="col-md-6 mb-2">
          <strong>{data.tipoDocumento} </strong> {data.numeroDocumento}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Centro de formación </strong>{" "}
          {data.centroFormacionIdcentroFormacion}
        </div>

        <div className="col-md-6 mb-2">
          <strong>Tel </strong> {data.celular}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Ficha </strong> {data.idgrupo}
        </div>

        <div className="col-md-6 mb-2">
          <strong>Correo </strong> {data.email}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Estado </strong>{" "}
          <Badge bg={data.estado === "activo" ? "success" : "danger"}>
            {data.estado}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <Container fluid className="p-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h3 className="fw-bold">
            Gestión de <span style={{color:'#5027BC'}}>Aprendices</span>
          </h3>
          <p className="text-muted">
            Administra y actualiza la información de los aprendices habilitados
            para participar en los procesos de votación.
          </p>
        </Col>
      </Row>

      <Row className="mb-3 d-flex justify-content-between">
        <Col sm={6}>
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </Col>
        <Col xs='auto'>
          <Button style={{backgroundColor:'#5027BC'}} onClick={()=>navigate('/aprendiz-form')}>
            <AiOutlinePlusCircle className="me-2 fs-3" />
            Nuevo Aprendiz
          </Button>
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
        expandableRows
        expandableRowsComponent={ExpandableComponent}
      />

      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Mostrando {filteredData.length} de {aprendices.length} resultados
        </small>
      </div>
    </Container>
  );
};

export default Aprendices;
