import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ConfirmarVoto from './pages/ConfirmarVoto'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/confirmar-voto' element={<ConfirmarVoto/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
