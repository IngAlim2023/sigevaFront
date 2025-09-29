import { Container, Button } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/auth.context";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import EleccionDetalleModal from "../../components/EleccionDetalleModal";
import { FiUserPlus, FiEdit, FiEye } from "react-icons/fi";
import { Row, Col, Form } from "react-bootstrap";
import EleccionEditarModal from "../../components/EleccionEditarModal";

interface Aprendiz {
  nombres: string;
  apellidos: string
}

interface Candidato {
  idcandidatos: string;
  numeroTarjeton: string;
  foto: string;
  aprendiz: Aprendiz;
}

interface Eleccion {
  ideleccion: number;
  titulo: string;
  regional: string,
  centro: string;
  jornada: string | null;
  fechaInicio: string;
  fechaFin: string;
  horaInicio?: string;
  horaFin?: string;
  estado?: string;
}

export default function EleccionesActivasPage() {
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedEleccion, setSelectedEleccion] = useState<Eleccion | null>(null);
  const [eleccionActiva, setEleccionActiva] = useState<Eleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCandidatos, setLoadingCandidatos] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [buscador, setBuscador] = useState("");
  const { user } = useAuth();
  const navegar = useNavigate();

  const loadData = async () => {
    if (!user?.centroFormacion) return;
    try {
      const res = await api.get(`/api/eleccion/traerTodas/${user.centroFormacion}`);
  
      setEleccionActiva(res.data.eleccionesActivas);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar las votaciones:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, [user?.centroFormacion]);

  // 🔹 Formatear fecha + hora en la misma celda
  const formatDateTime = (fecha: string, hora?: string) => {
    if (!fecha) return "Fecha no disponible";

    const date = hora ? new Date(hora) : new Date(fecha);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const handleDetalles = async (eleccion: Eleccion) => {
    if (loadingCandidatos) return;
    setSelectedEleccion(eleccion);
    setShowDetalleModal(true);
    setLoadingCandidatos(true);
    try {
      const res = await api.get(`/api/candidatos/listar/${eleccion.ideleccion}`);
      setCandidatos(res.data.data);
    } catch (error) {
      console.error("Error al cargar los candidatos:", error);
      setCandidatos([]);
    } finally {
      setLoadingCandidatos(false);
    }
  };

  const columns: TableColumn<Eleccion>[] = [
    {
      name: <b>#</b>,
      selector: (_row, index) => (index ?? 0) + 1,
      sortable: true,
      width: '70px',
      center: true,
    },
    {
      name: <b>Título</b>,
      selector: (row) => row.titulo,
      sortable: true,
      grow: 2,
      wrap: true,
      style: {
        whiteSpace: 'normal',
      }
    },
    {
      name: <b>Fecha inicio</b>,
      selector: (row) => formatDateTime(row.fechaInicio, row.horaInicio),
      sortable: true,
    },
    {
      name: <b>Fecha fin</b>,
      selector: (row) => formatDateTime(row.fechaFin, row.horaFin),
      sortable: true,
    },
    {
      name: <b>Jornada</b>,
      selector: (row) => row.jornada ?? "Sin jornada",
    },
    {
      name: <b>Estado</b>,
      cell: (row) => {
        const hoy = new Date();
        const fechaHoraFin = row.horaFin ? new Date(row.horaFin) : null;

        const estado = !fechaHoraFin || hoy <= fechaHoraFin ? "Activa" : "Cerrada";

        const style = {
          color: estado === "Activa" ? "green" : "orange",
          fontWeight: "bold",
        };

        return <span style={style}>{estado}</span>;
      },
    },
    {
      name: <b>Acciones</b>,
      cell: (row) => (
        <div className="d-flex gap-1 ">
          <Button
            size="sm"
            variant="outline-primary"
            className="text-nowrap"
            onClick={() => navegar(`/gestion-candidatos/${row.ideleccion}`)}
          >
            <FiUserPlus />
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            className="text-nowrap"
            onClick={() => {
              setSelectedEleccion(row)
              setShowEditarModal(true)
            }}
          >
            <FiEdit />

          </Button>


        </div>
      ),
      ignoreRowClick: true,

    },
    {
      name: <b>Generar PDF</b>,
      cell: (row) => (
        <Button onClick={() => handleDetalles(row)}>
          <FiEye />
        </Button>
      )
    }
  ];

  const query = (buscador ?? "").toLowerCase();

  const eleccionesFiltradas = eleccionActiva.filter((eleccion) =>
    eleccion?.titulo?.toLowerCase().includes(query)
  );

  return (
    <Container className="my-4 px-3">
      <h3 className="fw-bold">Bienvenido</h3>
      <p className="text-muted">
        Aquí tiene un resumen de la actividad reciente en SIGEVA.
      </p>

      <h5 className="fw-semibold mt-4">Resumen de Elecciones Activas</h5>

      <h3 className="fw-bold ">
        {eleccionActiva.length > 0
          ? `Centro de formación ${eleccionActiva[0].centro}`
          : "No hay centro asignado"}
      </h3>

      <Row className="align-items-center mt-3 mb-4">
        <Col md={8} lg={6} className="mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Buscar elección por nombre..."
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
          />
        </Col>
        <Col md={4} lg={6} className="d-flex justify-content-md-end">
          <Button className="btn-gradient" onClick={() => navegar("/nueva-eleccion")}>
            <FaPlusCircle className="me-2" /> Crear Elección
          </Button>
        </Col>
      </Row>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={eleccionesFiltradas}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="No hay elecciones activas en este momento."
        />
      </div>

      <EleccionDetalleModal
        show={showDetalleModal}
        onClose={() => {
          setShowDetalleModal(false);
          setCandidatos([]);
        }}
        eleccion={selectedEleccion}
        candidatos={candidatos}
      />

      <EleccionEditarModal
        show={showEditarModal}
        onHide={() => setShowEditarModal(false)}
        eleccion={selectedEleccion as any}
        onUpdated={() => {
          if (user?.centroFormacion) {
            api.get(`/api/eleccionPorCentro/${user?.centroFormacion}`)
              .then(res => {
                setEleccionActiva(res.data.eleccionesActivas)
                setLoading(false);
                loadData();
              })
              .catch(err => console.error("Error al recargar elecciones:", err));
          }
        }}

      />
    </Container>
  );
}
