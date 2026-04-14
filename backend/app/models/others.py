from sqlalchemy import Column, String, Float, Integer
from app.database import Base


class Consumidor(Base):
    __tablename__ = "dim_consumidores"

    id_consumidor = Column(String, primary_key=True, index=True)
    prefixo_cep = Column(Integer)
    nome_consumidor = Column(String)
    cidade = Column(String)
    estado = Column(String)


class Vendedor(Base):
    __tablename__ = "dim_vendedores"

    id_vendedor = Column(String, primary_key=True, index=True)
    nome_vendedor = Column(String)
    prefixo_cep = Column(Integer)
    cidade = Column(String)
    estado = Column(String)


class CategoriaImagem(Base):
    __tablename__ = "dim_categoria_imagens"

    categoria = Column(String, primary_key=True)
    link = Column(String)


class Pedido(Base):
    __tablename__ = "fat_pedidos"

    id_pedido = Column(String, primary_key=True, index=True)
    id_consumidor = Column(String)
    status = Column(String)
    pedido_compra_timestamp = Column(String)
    pedido_entregue_timestamp = Column(String)
    data_estimada_entrega = Column(String)
    tempo_entrega_dias = Column(Float)
    tempo_entrega_estimado_dias = Column(Integer)
    diferenca_entrega_dias = Column(Float)
    entrega_no_prazo = Column(String)


class ItemPedido(Base):
    __tablename__ = "fat_itens_pedidos"

    id_pedido = Column(String, primary_key=True)
    id_item = Column(Integer, primary_key=True)
    id_produto = Column(String, index=True)
    id_vendedor = Column(String)
    preco_BRL = Column(Float)
    preco_frete = Column(Float)


class AvaliacaoPedido(Base):
    __tablename__ = "fat_avaliacoes_pedidos"

    id_avaliacao = Column(String, primary_key=True, index=True)
    id_pedido = Column(String)
    avaliacao = Column(Integer)
    titulo_comentario = Column(String)
    comentario = Column(String)
    data_comentario = Column(String)
    data_resposta = Column(String)
