from pydantic import BaseModel
from typing import Optional, List


class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None


class ProdutoCreate(ProdutoBase):
    id_produto: str


class ProdutoUpdate(ProdutoBase):
    pass


class ProdutoResponse(ProdutoBase):
    id_produto: str

    class Config:
        from_attributes = True


class AvaliacaoInfo(BaseModel):
    id_avaliacao: str
    avaliacao: int
    titulo_comentario: Optional[str]
    comentario: Optional[str]
    data_comentario: Optional[str]

    class Config:
        from_attributes = True


class VendaInfo(BaseModel):
    id_pedido: str
    id_vendedor: str
    preco_BRL: float
    preco_frete: float

    class Config:
        from_attributes = True


class ProdutoDetalhe(ProdutoResponse):
    imagem_url: Optional[str] = None
    media_avaliacao: Optional[float] = None
    total_vendas: int = 0
    avaliacoes: List[AvaliacaoInfo] = []
    vendas: List[VendaInfo] = []
