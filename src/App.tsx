import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import VotacionesActivasPage from './pages/aprendiz/VotacionesActivasPage'
import Login from './pages/Login'
import ConfirmarVoto from './pages/aprendiz/ConfirmarVoto'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/votaciones' element={<VotacionesActivasPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/confirmar-voto' element={<ConfirmarVoto/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
