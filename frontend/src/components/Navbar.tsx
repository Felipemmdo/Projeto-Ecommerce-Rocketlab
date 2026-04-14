import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      background: '#1a1a2e',
      color: '#fff',
      padding: '0 32px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#e94560' }}>
        🛒 E-Commerce Manager
      </Link>
      <div style={{ display: 'flex', gap: 24 }}>
        <Link to="/" style={{ color: '#ccc', fontWeight: 500 }}>Catálogo</Link>
        <Link to="/novo" style={{
          background: '#e94560',
          color: '#fff',
          padding: '6px 16px',
          borderRadius: 6,
          fontWeight: 600
        }}>+ Novo Produto</Link>
      </div>
    </nav>
  )
}
