import { BrowserRouter, Route, Routes, Navigate, Outlet} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import VotacionesActivasPage from './pages/aprendiz/VotacionesActivasPage'
import Login from './pages/Login'
import CandidateSelectionPage from './pages/aprendiz/SeleccionarCandidatoPage'
import ConfirmarVoto from './pages/aprendiz/ConfirmarVoto'
import Navbar from './pages/Navbar'
import GestionCandidatos from './pages/funcionario/GestionCandidatos'
import  EleccionesActivasPage  from './pages/funcionario/EleccionesActivasPage'
import AgregarCandidato from './pages/funcionario/AgregarCandidato'
import FormEleccion from './pages/funcionario/FormEleccion'

function PublicLayout() {
  return <Outlet />;
}

// Layout con navbar + guard
function PrivateLayout() {
  // const isAuth = !!localStorage.getItem("token");
  // if (!isAuth) return <Navigate to="/" replace />;
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Login/>}/>
        <Route path='/seleccion' element={<CandidateSelectionPage/>}/>
     
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seleccion" element={<CandidateSelectionPage />} />
          <Route path="/votaciones" element={<VotacionesActivasPage />} />
          <Route path="/elecciones" element={<EleccionesActivasPage />} />
          <Route path='/confirmar-voto' element={<ConfirmarVoto/>} />
          <Route path='/gestion-candidatos' element={<GestionCandidatos/>} />
          <Route path='/agregar-candidato' element={<AgregarCandidato/>} />
          <Route path='/form-eleccion' element={<FormEleccion/>} />
        </Route>

        {/* Redirección en caso de ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;