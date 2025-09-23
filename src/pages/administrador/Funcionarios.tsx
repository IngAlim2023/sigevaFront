import React, { useEffect, useState } from "react";
import { Button, Table, Form, Pagination, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { EditarFuncionarioModal } from "./modals/EditarFuncionarioModal";
import { CrearFuncionarioModal } from "./modals/CrearFuncionarioModal";
import { FuncionarioDetalleModal } from "./modals/FuncionarioDetalleModal"; 
import { api } from "../../api";

// ----------------- Interfaces -----------------
interface Regional {
  idregional: number;
  regional: string;
  telefono: string;
  direccion: string;
}

interface CentroFormacion {
  idcentroFormacion: number;
  centroFormacioncol: string;
  direccion: string;
  telefono: string;
  correo: string;
  subdirector: string;
  correosubdirector: string;
  regional: Regional;
}

interface Funcionario {
  id: number;
  email: string;
  estado: string;
  centroFormacion?: CentroFormacion; // opcional por seguridad
}

const ITEMS_PER_PAGE = 5;

// ----------------- Componente -----------------
const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // estados de formulario
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombres:"",
    apellidos:"",
    celular:"",
    numero_documento:"",
    email: "",
    estado: "activo",
    idcentro_formacion: 1,
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // estados de detalle
  const [detalleFuncionario, setDetalleFuncionario] = useState<Funcionario | null>(null);
  const [showDetalle, setShowDetalle] = useState(false);

  // estados de tabla
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  // --------- FILTRO ---------
  const funcionariosFiltrados = funcionarios.filter((func) =>
    func.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    func.centroFormacion?.centroFormacioncol
      ?.toLowerCase()
      .includes(busqueda.toLowerCase()) ||
    func.centroFormacion?.regional?.regional
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // --------- PAGINACIÓN ---------
  const totalPages = Math.ceil(funcionariosFiltrados.length / ITEMS_PER_PAGE);
  const currentFuncionarios = funcionariosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --------- CARGA DE DATOS ---------
  const cargarFuncionarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("api/usuarios/funcionarios");
      setFuncionarios(response.data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar los funcionarios";
      setError(message);
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5027BC",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------- CREAR / EDITAR ---------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const isEditing = Boolean(editingId);
      const url = isEditing ? `api/usuarios/${editingId}` : "api/usuarios/crear";
      const requestData = {
        nombres:formData.nombres,
        apellidos:formData.apellidos,
        celular:formData.celular,
        numero_documento:formData.numero_documento,
        email: formData.email,
        estado: formData.estado,
        idcentro_formacion: formData.idcentro_formacion.toString(),
        idperfil: 2,
        ...(!isEditing && { password: formData.password }),
      };
      isEditing
        ? await api.put(url, requestData)
        : await api.post(url, requestData);

      await Swal.fire({
        title: "¡Éxito!",
        text: `Funcionario ${isEditing ? "actualizado" : "creado"} correctamente`,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5027BC",
      });
      await cargarFuncionarios();
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setFormError(message);
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5027BC",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // --------- ACTIVAR/DESACTIVAR ---------
  const handleToggleStatus = async (id: number, nuevoEstado: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas ${
        nuevoEstado === "activo" ? "activar" : "desactivar"
      } este funcionario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5027BC",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/usuarios/${id}`, { estado: nuevoEstado });
      setFuncionarios(
        funcionarios.map((func) =>
          func.id === id ? { ...func, estado: nuevoEstado } : func
        )
      );
      await Swal.fire({
        title: "¡Éxito!",
        text: "Estado del funcionario actualizado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5027BC",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar el estado";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5027BC",
      });
    }
  };

  // --------- HANDLERS ---------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = (funcionario: Funcionario) => {
    setFormData({
      email: funcionario.email,
      estado: funcionario.estado,
      idcentro_formacion: funcionario.centroFormacion?.idcentroFormacion || 1,
      password: "",
    });
    setEditingId(funcionario.id);
    setShowModal(true);
  };

  const handleVerDetalle = (funcionario: Funcionario) => {
    setDetalleFuncionario(funcionario);
    setShowDetalle(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setFormError(null);
    setFormData({
      email: "",
      estado: "activo",
      idcentro_formacion: 1,
      password: "",
    });
    setEditingId(null);
  };

  useEffect(() => {
    cargarFuncionarios();
  }, []);

  // ----------------- Render -----------------
  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold">Gestión de Funcionarios de Bienestar</h2>
        <p className="text-muted">
          Consulta, crea y actualiza los perfiles del equipo de Bienestar
          encargados de coordinar los procesos electorales en cada centro de
          formación.
        </p>
      </div>

      {/* Buscador + Botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="w-50">
          <InputGroup>
            <InputGroup.Text className="bg-white">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar por correo..."
              className="border-start-0"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" /> Nuevo Funcionario
        </Button>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Email</th>
              <th>Estado</th>
              <th>Centro de Formación</th>
              <th>Regional</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center text-danger">{error}</td>
              </tr>
            ) : funcionarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">No hay funcionarios registrados</td>
              </tr>
            ) : (
              currentFuncionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.email}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        funcionario.estado === "activo" ? "success" : "danger"
                      }`}
                    >
                      {funcionario.estado}
                    </span>
                  </td>
                  <td>{funcionario.centroFormacion?.centroFormacioncol || "Sin centro"}</td>
                  <td>{funcionario.centroFormacion?.regional?.regional || "Sin regional"}</td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleVerDetalle(funcionario)}
                      className="me-2"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditar(funcionario)}
                      className="me-2"
                    >
                      <FaEdit className="me-1" /> Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() =>
                        handleToggleStatus(
                          funcionario.id,
                          funcionario.estado === "activo" ? "inactivo" : "activo"
                        )
                      }
                    >
                      {funcionario.estado === "activo" ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination className="d-flex justify-content-center mt-3">
          <Pagination.Prev
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;
            return (
              <Pagination.Item
                key={pageNum}
                active={pageNum === currentPage}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Pagination.Item>
            );
          })}
          <Pagination.Next
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}

      {/* Modal Crear */}
<CrearFuncionarioModal
  show={showModal && !editingId}
  onHide={resetForm}
  error={formError || undefined}
  loading={formLoading}
/>

{/* Modal Editar */}
<EditarFuncionarioModal
  show={showModal && !!editingId}
  onHide={resetForm}
  onSubmit={handleSubmit}
  formData={formData}
  onInputChange={handleInputChange}
  error={formError || undefined}
  loading={formLoading}
/>

{/* Modal Detalle */}
<FuncionarioDetalleModal
  showModal={showDetalle}
  handleClose={() => setShowDetalle(false)}
  funcionario={detalleFuncionario}
/>

    </div>
  );
};

export default Funcionarios;
