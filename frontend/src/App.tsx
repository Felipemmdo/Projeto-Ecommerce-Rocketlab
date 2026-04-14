import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './pages/Catalogo'
import DetalhesProduto from './pages/DetalhesProduto'
import NovoProduto from './pages/NovoProduto'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/produtos/:id" element={<DetalhesProduto />} />
          <Route path="/novo" element={<NovoProduto />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
