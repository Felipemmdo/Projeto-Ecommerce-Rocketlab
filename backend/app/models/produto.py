from sqlalchemy import Column, String, Float, Integer
from app.database import Base


class Produto(Base):
    __tablename__ = "dim_produtos"

    id_produto = Column(String, primary_key=True, index=True)
    nome_produto = Column(String)
    categoria_produto = Column(String)
    peso_produto_gramas = Column(Float)
    comprimento_centimetros = Column(Float)
    altura_centimetros = Column(Float)
    largura_centimetros = Column(Float)
