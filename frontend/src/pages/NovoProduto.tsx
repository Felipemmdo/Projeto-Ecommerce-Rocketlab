import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { criarProduto, ProdutoCreate } from '../services/api'

export default function NovoProduto() {
  const navigate = useNavigate()
  const [form, setForm] = useState<ProdutoCreate>({
    id_produto: '',
    nome_produto: '',
    categoria_produto: '',
    peso_produto_gramas: undefined,
    comprimento_centimetros: undefined,
    altura_centimetros: undefined,
    largura_centimetros: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.id_produto || !form.nome_produto || !form.categoria_produto) {
      setErro('Preencha ID, nome e categoria.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const p = await criarProduto(form)
      navigate(`/produtos/${p.id_produto}`)
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Erro ao criar produto.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof ProdutoCreate) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ color: '#888', fontSize: 14 }}>← Voltar ao catálogo</Link>
      </div>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 22, marginBottom: 24 }}>Novo Produto</h2>

        {erro && <p style={{ color: 'red', marginBottom: 12, fontSize: 14 }}>{erro}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={labelStyle}>
            ID do Produto *
            <input required value={form.id_produto} onChange={set('id_produto')} style={inputStyle} placeholder="Ex: abc123..." />
          </label>
          <label style={labelStyle}>
            Nome *
            <input required value={form.nome_produto} onChange={set('nome_produto')} style={inputStyle} placeholder="Nome do produto" />
          </label>
          <label style={labelStyle}>
            Categoria *
            <input required value={form.categoria_produto} onChange={set('categoria_produto')} style={inputStyle} placeholder="Ex: perfumaria" />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={labelStyle}>
              Peso (g)
              <input type="number" value={form.peso_produto_gramas ?? ''} onChange={set('peso_produto_gramas')} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Comprimento (cm)
              <input type="number" value={form.comprimento_centimetros ?? ''} onChange={set('comprimento_centimetros')} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Altura (cm)
              <input type="number" value={form.altura_centimetros ?? ''} onChange={set('altura_centimetros')} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Largura (cm)
              <input type="number" value={form.largura_centimetros ?? ''} onChange={set('largura_centimetros')} style={inputStyle} />
            </label>
          </div>

          <button type="submit" disabled={loading} style={{ ...btnStyle, marginTop: 8 }}>
            {loading ? 'Criando...' : 'Criar Produto'}
          </button>
        </form>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: 28,
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)'
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  fontSize: 14
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#555',
  fontWeight: 600
}

const btnStyle: React.CSSProperties = {
  background: '#e94560',
  color: '#fff',
  border: 'none',
  padding: '10px 0',
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 15,
  width: '100%'
}
