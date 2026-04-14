from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import Produto, Consumidor, Vendedor, CategoriaImagem, Pedido, ItemPedido, AvaliacaoPedido
from app.routers import produtos

Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos.router)


@app.get("/")
def root():
    return {"message": "E-Commerce API"}
