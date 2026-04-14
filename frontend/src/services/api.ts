import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export interface Produto {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
  imagem_url?: string;
}

export interface AvaliacaoInfo {
  id_avaliacao: string
  avaliacao: number
  titulo_comentario: string | null
  comentario: string | null
  data_comentario: string | null
}

export interface VendaInfo {
  id_pedido: string
  id_vendedor: string
  preco_BRL: number
  preco_frete: number
}

export interface ProdutoDetalhe extends Produto {
  imagem_url: string | null
  media_avaliacao: number | null
  total_vendas: number
  avaliacoes: AvaliacaoInfo[]
  vendas: VendaInfo[]
}

export interface ProdutoCreate {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas?: number
  comprimento_centimetros?: number
  altura_centimetros?: number
  largura_centimetros?: number
}

export interface ProdutoUpdate {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas?: number
  comprimento_centimetros?: number
  altura_centimetros?: number
  largura_centimetros?: number
}

export const getProdutos = (busca?: string, categoria?: string) =>
  api.get<Produto[]>('/produtos', { params: { busca, categoria } }).then(r => r.data)

export const getCategorias = () =>
  api.get<string[]>('/produtos/categorias').then(r => r.data)

export const getProduto = (id: string) =>
  api.get<ProdutoDetalhe>(`/produtos/${id}`).then(r => r.data)

export const criarProduto = (p: ProdutoCreate) =>
  api.post<Produto>('/produtos', p).then(r => r.data)

export const atualizarProduto = (id: string, p: ProdutoUpdate) =>
  api.put<Produto>(`/produtos/${id}`, p).then(r => r.data)

export const deletarProduto = (id: string) =>
  api.delete(`/produtos/${id}`)
