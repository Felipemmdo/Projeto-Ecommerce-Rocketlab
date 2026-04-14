import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduto, atualizarProduto, deletarProduto, ProdutoDetalhe, ProdutoUpdate } from '../services/api'

export default function DetalhesProduto() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null)
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState<ProdutoUpdate>({
    nome_produto: '',
    categoria_produto: '',
    peso_produto_gramas: undefined,
    comprimento_centimetros: undefined,
    altura_centimetros: undefined,
    largura_centimetros: undefined,
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!id) return
    getProduto(id).then(p => {
      setProduto(p)
      setForm({
        nome_produto: p.nome_produto,
        categoria_produto: p.categoria_produto,
        peso_produto_gramas: p.peso_produto_gramas ?? undefined,
        comprimento_centimetros: p.comprimento_centimetros ?? undefined,
        altura_centimetros: p.altura_centimetros ?? undefined,
        largura_centimetros: p.largura_centimetros ?? undefined,
      })
    }).catch(() => setErro('Produto não encontrado.')).finally(() => setLoading(false))
  }, [id])

  const handleSalvar = async () => {
    if (!id) return
    setSalvando(true)
    try {
      const updated = await atualizarProduto(id, form)
      setProduto(prev => prev ? { ...prev, ...updated } : null)
      setEditando(false)
    } catch {
      alert('Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  const handleDeletar = async () => {
    if (!id || !confirm('Remover este produto?')) return
    await deletarProduto(id)
    navigate('/')
  }

  if (loading) return <p style={{ color: '#888' }}>Carregando...</p>
  if (erro || !produto) return <p style={{ color: 'red' }}>{erro || 'Produto não encontrado.'}</p>

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ color: '#888', fontSize: 14 }}>← Voltar ao catálogo</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Coluna esquerda */}
        <div>
          {produto.imagem_url ? (
            <img src={produto.imagem_url} alt={produto.categoria_produto}
              style={{ width: '100%', borderRadius: 10, objectFit: 'cover', maxHeight: 260 }} />
          ) : (
            <div style={{ background: '#e8e8e8', borderRadius: 10, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 40 }}>
              📦
            </div>
          )}

          {/* Info card */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>
              {editando
                ? <input value={form.nome_produto} onChange={e => setForm(f => ({ ...f, nome_produto: e.target.value }))} style={inputStyle} />
                : produto.nome_produto
              }
            </h2>
            <p style={{ color: '#888', marginBottom: 16 }}>
              {editando
                ? <input value={form.categoria_produto} onChange={e => setForm(f => ({ ...f, categoria_produto: e.target.value }))} style={inputStyle} />
                : produto.categoria_produto
              }
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {[
                  ['Peso', 'peso_produto_gramas', 'g'],
                  ['Comprimento', 'comprimento_centimetros', 'cm'],
                  ['Altura', 'altura_centimetros', 'cm'],
                  ['Largura', 'largura_centimetros', 'cm'],
                ].map(([label, field, unit]) => (
                  <tr key={field} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 0', color: '#888' }}>{label}</td>
                    <td style={{ padding: '8px 0', fontWeight: 500 }}>
                      {editando
                        ? <input
                            type="number"
                            value={(form as any)[field] ?? ''}
                            onChange={e => setForm(f => ({ ...f, [field]: e.target.value ? Number(e.target.value) : undefined }))}
                            style={{ ...inputStyle, width: 100 }}
                          />
                        : `${(produto as any)[field] ?? '—'} ${unit}`
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {editando ? (
                <>
                  <button onClick={handleSalvar} disabled={salvando} style={btnStyle}>
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => setEditando(false)} style={btnGhostStyle}>Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditando(true)} style={btnStyle}>✏️ Editar</button>
                  <button onClick={handleDeletar} style={btnDangerStyle}>🗑 Remover</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={statCardStyle}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{produto.total_vendas}</div>
              <div style={{ color: '#888', fontSize: 13 }}>Vendas</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#e94560' }}>
                {produto.media_avaliacao?.toFixed(1) ?? '—'}
              </div>
              <div style={{ color: '#888', fontSize: 13 }}>Média ★</div>
            </div>
          </div>

          {/* Avaliações */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: 12 }}>Avaliações dos clientes</h3>
            {produto.avaliacoes.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: 13 }}>Nenhuma avaliação.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                {produto.avaliacoes.map(a => (
                  <div key={a.id_avaliacao} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
                    <div style={{ color: '#f5a623', fontSize: 14 }}>{stars(a.avaliacao)}</div>
                    {a.titulo_comentario && a.titulo_comentario !== 'Sem título' && (
                      <p style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{a.titulo_comentario}</p>
                    )}
                    {a.comentario && a.comentario !== 'Sem comentário' && (
                      <p style={{ color: '#555', fontSize: 13 }}>{a.comentario}</p>
                    )}
                    <p style={{ color: '#bbb', fontSize: 11, marginTop: 2 }}>{a.data_comentario?.slice(0, 10)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vendas recentes */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: 12 }}>Vendas recentes</h3>
            {produto.vendas.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: 13 }}>Nenhuma venda.</p>
            ) : (
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8f8f8' }}>
                      <th style={thStyle}>Pedido</th>
                      <th style={thStyle}>Preço</th>
                      <th style={thStyle}>Frete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produto.vendas.map(v => (
                      <tr key={v.id_pedido} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={tdStyle}>{v.id_pedido.slice(0, 8)}…</td>
                        <td style={tdStyle}>R$ {v.preco_BRL.toFixed(2)}</td>
                        <td style={tdStyle}>R$ {v.preco_frete.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: 20,
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  marginTop: 16
}

const statCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: 20,
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  textAlign: 'center'
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: 6,
  padding: '6px 10px',
  fontSize: 14,
  width: '100%'
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

const btnGhostStyle: React.CSSProperties = {
  background: 'transparent',
  color: '#555',
  border: '1px solid #ddd',
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
  fontWeight: 600,
  fontSize: 14
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '6px 8px',
  color: '#888',
  fontWeight: 600
}

const tdStyle: React.CSSProperties = {
  padding: '6px 8px'
}
