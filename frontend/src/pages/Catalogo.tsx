import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProdutos, getCategorias, deletarProduto, Produto } from '../services/api'

export default function Catalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = async () => {
    setLoading(true)
    setErro('')
    try {
      const data = await getProdutos(busca || undefined, categoria || undefined)
      setProdutos(data)
    } catch {
      setErro('Erro ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    carregar()
  }, [categoria])

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault()
    carregar()
  }

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Remover "${nome}"?`)) return
    await deletarProduto(id)
    setProdutos(prev => prev.filter(p => p.id_produto !== id))
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Catálogo de Produtos</h1>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <form onSubmit={handleBusca} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={btnStyle}>Buscar</button>
        </form>
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          style={{ ...inputStyle, minWidth: 180 }}
        >
          <option value="">Todas as categorias</option>
          {categorias.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {erro && <p style={{ color: 'red', marginBottom: 16 }}>{erro}</p>}
      {loading && <p style={{ color: '#888' }}>Carregando...</p>}

      {!loading && produtos.length === 0 && (
        <p style={{ color: '#888' }}>Nenhum produto encontrado.</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16
      }}>
        {produtos.map(p => (
          <div key={p.id_produto} style={cardStyle}>
            {p.imagem_url ? (
            <img 
            src={p.imagem_url} 
            alt={p.nome_produto} 
            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }} 
            />
          ) : (
            <div style={{ background: '#f0f0f0', height: 140, borderRadius: 6, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>
            📦 {p.categoria_produto}
            </div>
          )}
            <h3 style={{ fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>{p.nome_produto}</h3>
            <p style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>{p.categoria_produto}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <Link
                to={`/produtos/${p.id_produto}`}
                style={{ ...btnStyle, flex: 1, textAlign: 'center', fontSize: 13 }}
              >
                Ver detalhes
              </Link>
              <button
                onClick={() => handleDeletar(p.id_produto, p.nome_produto)}
                style={{ ...btnDangerStyle, fontSize: 13, padding: '6px 12px' }}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  fontSize: 14,
  outline: 'none',
  flex: 1
}

const btnStyle: React.CSSProperties = {
  background: '#1a1a2e',
  color: '#fff',
  border: 'none',
  padding: '8px 18px',
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 14
}

const btnDangerStyle: React.CSSProperties = {
  background: '#e94560',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 6,
  fontWeight: 600
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: 16,
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column'
}
