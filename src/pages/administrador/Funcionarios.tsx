import React, { useEffect, useState, useMemo } from "react";
import { Button, Table, Form, Pagination, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { FuncionarioFormModal } from "./modals/FuncionarioFormModal";

interface Funcionario {
  id: number;
  email: string;
  estado: string;
  idcentro_formacion: number;
}

// Función para obtener el nombre del perfil basado en el idcentro_formacion
const getNombrePerfil = (idcentro_formacion: number): string => {
  // Si el idcentro_formacion es 1, es Funcionario
  // Si necesitas mapear otros centros de formación, puedes expandir este objeto
  return idcentro_formacion === 1 ? 'Funcionario' : `Centro ${idcentro_formacion}`;
};

const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<Omit<Funcionario, 'id'> & { password?: string; idperfil: number }>({ 
    email: '',
    estado: 'activo',
    idcentro_formacion: 1, // Valor por defecto para el centro de formación
    idperfil: 2, // Valor por defecto para funcionario
    password: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const itemsPerPage = 5; // Número de elementos por página
  
  // Endpoints
  const API_BASE_URL = 'https://sigevaback-real.onrender.com/api/usuarios';
  const FUNCIONARIOS_URL = `${API_BASE_URL}/funcionarios`;
  const CREAR_FUNCIONARIO_URL = `${API_BASE_URL}/crear`;

  const cargarFuncionarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(FUNCIONARIOS_URL);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al cargar los funcionarios');
      }
      
      const data = await response.json();
      setFuncionarios(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los funcionarios';
      setError(errorMessage);
      
      // Mostrar notificación de error
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5027BC',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const isEditing = Boolean(editingId);
      const url = isEditing 
        ? `${API_BASE_URL}/${editingId}`
        : CREAR_FUNCIONARIO_URL;
      
      // Preparar datos para enviar según el formato requerido
      const requestData = {
        email: formData.email,
        estado: formData.estado,
        idcentro_formacion: formData.idcentro_formacion.toString(), // Asegurar que sea string
        idperfil: 2, // Siempre 2 para funcionario
        ...(!isEditing && { password: formData.password }) // Solo incluir password para creación
      };
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el funcionario`);
      }
      
      // Mostrar mensaje de éxito y recargar la lista
      await Swal.fire({
        title: '¡Éxito!',
        text: `Funcionario ${isEditing ? 'actualizado' : 'creado'} correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5027BC',
      });
      
      // Recargar la lista de funcionarios
      await cargarFuncionarios();
      
      // Cerrar el modal y limpiar el formulario
      setShowModal(false);
      setFormError(null);
      setFormData({ 
        email: '',
        estado: 'activo',
        idcentro_formacion: 1,
        idperfil: 2,
        password: ''
      });
      setEditingId(null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setFormError(errorMessage);
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5027BC',
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleToggleStatus = async (id: number, nuevoEstado: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas ${nuevoEstado === 'activo' ? 'activar' : 'desactivar'} este funcionario?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5027BC',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      });
      
      if (!result.isConfirmed) return;
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar el estado del funcionario');
      }
      
      // Actualizar el estado local
      setFuncionarios(funcionarios.map(func => 
        func.id === id ? { ...func, estado: nuevoEstado } : func
      ));
      
      // Mostrar notificación de éxito
      await Swal.fire({
        title: '¡Éxito!',
        text: `Estado del funcionario actualizado correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5027BC',
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el estado';
      
      // Mostrar notificación de error
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5027BC',
      });
    }
  };

  useEffect(() => {
    cargarFuncionarios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditar = (funcionario: Funcionario) => {
    setFormData({
      email: funcionario.email,
      estado: funcionario.estado,
      idcentro_formacion: funcionario.idcentro_formacion
      // No incluimos el password al editar
    });
    setEditingId(funcionario.id);
    setShowModal(true);
  };

  // Calcular el total de páginas
  const totalPages = Math.ceil(funcionarios.length / itemsPerPage);
  
  // Obtener funcionarios para la página actual
  const currentFuncionarios = funcionarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Manejar cambio de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold">Gestión de Funcionarios de Bienestar</h2>
        <p className="text-muted">
          Consulta, crea y actualiza los perfiles del equipo de Bienestar encargados de coordinar los procesos electorales en cada centro de formación.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="w-50">
          <InputGroup>
            <InputGroup.Text className="bg-white">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar por correo o centro de formación..."
              className="border-start-0"
            />
          </InputGroup>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            setFormData({ 
              email: '',
              estado: 'activo',
              idcentro_formacion: 1,
              idperfil: 2,
              password: ''
            });
            setEditingId(null);
            setShowModal(true);
          }}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" /> Nuevo Funcionario
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Email</th>
              <th>Estado</th>
              <th>Perfil</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center text-danger">{error}</td>
              </tr>
            ) : funcionarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">No hay funcionarios registrados</td>
              </tr>
            ) : (
              currentFuncionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.email}</td>
                  <td>
                    <span className={`badge bg-${funcionario.estado === 'activo' ? 'success' : 'danger'}`}>
                      {funcionario.estado}
                    </span>
                  </td>
                  <td>{getNombrePerfil(funcionario.idcentro_formacion)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleEditar(funcionario)}
                    >
                      <FaEdit className="me-1" /> Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleToggleStatus(funcionario.id, funcionario.estado === 'activo' ? 'inactivo' : 'activo')}
                    >
                      {funcionario.estado === 'activo' ? 'Desactivar' : 'Activar'}
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
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Mostrar máximo 5 páginas a la vez
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Pagination.Item 
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            <Pagination.Next 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      <FuncionarioFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setFormError(null);
          setFormData({ 
            email: '',
            estado: 'activo',
            idcentro_formacion: 1,
            idperfil: 2,
            password: ''
          });
          setEditingId(null);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        isEditing={!!editingId}
        error={formError}
        loading={formLoading}
      />
    </div>
  );
};

export default Funcionarios;
