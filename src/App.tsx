import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import VotacionesActivasPage from './pages/aprendiz/VotacionesActivasPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/votaciones' element={<VotacionesActivasPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
