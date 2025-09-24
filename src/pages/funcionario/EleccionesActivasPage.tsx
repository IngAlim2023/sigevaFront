import { Container, Button } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/auth.context";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import EleccionDetalleModal from "../../components/EleccionDetalleModal";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedEleccion, setSelectedEleccion] = useState<Eleccion | null>(null);
  const [eleccionActiva, setEleccionActiva] = useState<Eleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navegar = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.centroFormacion) return;
      try {
        const res = await api.get(`/api/eleccion/traerTodas/${user.centroFormacion}`);
        console.log("las elecciones son: ", res.data);
        setEleccionActiva(res.data.eleccionesActivas);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las votaciones:", error);
      }
    };
    loadData();
  }, [user?.centroFormacion]);

  // 🔹 Formatear fecha + hora en la misma celda
  const formatDateTime = (fecha: string, hora?: string) => {
    if (!fecha) return "Fecha no disponible";

    const date = hora ? new Date(hora) : new Date(fecha); // usamos hora si viene, si no la fecha
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };


  // 🔹 Definimos las columnas del DataTable
  const columns: TableColumn<Eleccion>[] = [
    {
      name: <b>Título</b>,
      selector: (row) => row.titulo,
      sortable: true,
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
      selector: (row) => {
        if (!row.fechaFin) return "Activa";

        const hoy = new Date();
        const fechaFin = new Date(row.fechaFin);

        return hoy > fechaFin ? "Cerrada" : "Activa";
      },
    },
    {
      name: <b>Acciones</b>,
      cell: (row) => (
        <div className=" gap-2 d-flex ">
          <Button
            size="sm"
            variant="outline-primary"
            className="text-nowrap"
            onClick={() => navegar(`/gestion-candidatos/${row.ideleccion}`)}
          >
            Add candidatos
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            className="text-nowrap"
            onClick={() => setSelectedEleccion(row)}
          >
            Editar
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Container className="my-4">

      <h3 className="fw-bold text-center ">
        {eleccionActiva.length > 0
          ? `Centro de formación ${eleccionActiva[0].centro}`
          : "No hay centro asignado"}
      </h3>

      {/* Botones arriba */}
      <div className="d-flex justify-content-end gap-3 mt-3">
        {/* <Button className="btn-gradient" onClick={() => navegar("/cargar-aprendices")}>
          <FaPlusCircle /> Agregar Candidatos
        </Button> */}

        <Button className="btn-gradient" onClick={() => navegar("/nueva-eleccion")}>
          <FaPlusCircle /> Crear Elección
        </Button>
      </div>


      <div className="mt-4">
        <DataTable
          columns={columns}
          data={eleccionActiva}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="No hay elecciones activas en este momento."
        />
      </div>

      {/* Modal Detalle */}
      <EleccionDetalleModal
        show={showModal}
        onClose={() => setShowModal(false)}
        eleccion={selectedEleccion}
        candidatos={[]} // 🔹 después puedes cargar los candidatos aquí
      />
    </Container>
  );
}
