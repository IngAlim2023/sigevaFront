import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import VotacionesActivasPage from "./pages/aprendiz/VotacionesActivasPage";
import Login from "./pages/Login";
import CandidateSelectionPage from "./pages/aprendiz/SeleccionarCandidatoPage";
import ConfirmarVoto from "./pages/aprendiz/ConfirmarVoto";
import GestionCandidatos from "./pages/funcionario/GestionCandidatos";
import CargarAprendices from "./pages/funcionario/CargarAprendices";
import PanelMetricas from "./pages/funcionario/PanelMetricas";
import EleccionesActivasPage from "./pages/funcionario/EleccionesActivasPage";
import AgregarCandidato from "./pages/funcionario/AgregarCandidato";
import FormEleccion from "./pages/funcionario/FormEleccion";
import MainLayout from "./layouts/MainLayout";
import { useAuth } from "./context/auth/auth.context";

function PublicLayout() {
  return <Outlet />;
}

function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  // const isAuth = !!localStorage.getItem("token");
  // if (!isAuth) return <Navigate to="/" replace />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function FuncionarioLayout() {
  return (
    <MainLayout showSidebar={true}>
      <Outlet />
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route
            path="/login-funcionario"
            element={<Login perfil="funcionario" />}
          />
          <Route path="/login-aprendiz" element={<Login perfil="aprendiz" />} />
        </Route>

        {/* Rutas de Aprendiz */}
        <Route element={<PrivateLayout />}>
          <Route path="/votaciones" element={<VotacionesActivasPage />} />
          <Route path="/seleccion" element={<CandidateSelectionPage />} />
          <Route path="/confirmar-voto" element={<ConfirmarVoto />} />
          {/* Rutas de Funcionario */}
          <Route element={<FuncionarioLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gestion-candidatos" element={<GestionCandidatos />} />
            <Route path="/cargar-aprendices" element={<CargarAprendices />} />
            <Route path="/panel-metricas" element={<PanelMetricas />} />
            <Route path="/elecciones" element={<EleccionesActivasPage />} />
            <Route path="/agregar-candidato" element={<AgregarCandidato />} />
            <Route path="/nueva-eleccion" element={<FormEleccion />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
