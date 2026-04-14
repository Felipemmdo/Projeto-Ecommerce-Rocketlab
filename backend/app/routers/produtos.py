from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.produto import Produto
from app.models.others import CategoriaImagem, ItemPedido, Pedido, AvaliacaoPedido
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse, ProdutoDetalhe, AvaliacaoInfo, VendaInfo

router = APIRouter(prefix="/produtos", tags=["produtos"])


@router.get("/")
def listar_produtos(
    busca: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    # OUTER JOIN com a tabela de imagens
    query = db.query(Produto, CategoriaImagem.link).outerjoin(
        CategoriaImagem, Produto.categoria_produto == CategoriaImagem.categoria
    )
    
    if busca:
        query = query.filter(Produto.nome_produto.ilike(f"%{busca}%"))
    if categoria:
        query = query.filter(Produto.categoria_produto == categoria)
        
    resultados = query.offset(skip).limit(limit).all()
    
    # resposta incluindo o link da imagem
    produtos_formatados = []
    for produto, link in resultados:
        prod_dict = {c.name: getattr(produto, c.name) for c in produto.__table__.columns}
        prod_dict["imagem_url"] = link
        produtos_formatados.append(prod_dict)
        
    return produtos_formatados


@router.get("/categorias", response_model=List[str])
def listar_categorias(db: Session = Depends(get_db)):
    cats = db.query(Produto.categoria_produto).distinct().all()
    return [c[0] for c in cats if c[0]]


@router.get("/{id_produto}", response_model=ProdutoDetalhe)
def detalhe_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    # Imagem da categoria
    cat_img = db.query(CategoriaImagem).filter(
        CategoriaImagem.categoria == produto.categoria_produto
    ).first()
    imagem_url = cat_img.link if cat_img else None

    # Vendas do produto
    itens = db.query(ItemPedido).filter(ItemPedido.id_produto == id_produto).all()

    # Avaliacoes via pedidos
    ids_pedidos = [i.id_pedido for i in itens]
    avaliacoes_raw = []
    media = None
    if ids_pedidos:
        avaliacoes_raw = db.query(AvaliacaoPedido).filter(
            AvaliacaoPedido.id_pedido.in_(ids_pedidos)
        ).all()
        if avaliacoes_raw:
            media = round(sum(a.avaliacao for a in avaliacoes_raw) / len(avaliacoes_raw), 2)

    return ProdutoDetalhe(
        **{c.name: getattr(produto, c.name) for c in produto.__table__.columns},
        imagem_url=imagem_url,
        media_avaliacao=media,
        total_vendas=len(itens),
        avaliacoes=[AvaliacaoInfo(
            id_avaliacao=a.id_avaliacao,
            avaliacao=a.avaliacao,
            titulo_comentario=a.titulo_comentario,
            comentario=a.comentario,
            data_comentario=a.data_comentario
        ) for a in avaliacoes_raw[:20]],
        vendas=[VendaInfo(
            id_pedido=i.id_pedido,
            id_vendedor=i.id_vendedor,
            preco_BRL=i.preco_BRL,
            preco_frete=i.preco_frete
        ) for i in itens[:20]]
    )


@router.post("/", response_model=ProdutoResponse, status_code=201)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    existing = db.query(Produto).filter(Produto.id_produto == produto.id_produto).first()
    if existing:
        raise HTTPException(status_code=400, detail="Produto já existe")
    db_produto = Produto(**produto.model_dump())
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto


@router.put("/{id_produto}", response_model=ProdutoResponse)
def atualizar_produto(id_produto: str, produto: ProdutoUpdate, db: Session = Depends(get_db)):
    db_produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for key, value in produto.model_dump().items():
        setattr(db_produto, key, value)
    db.commit()
    db.refresh(db_produto)
    return db_produto


@router.delete("/{id_produto}", status_code=204)
def deletar_produto(id_produto: str, db: Session = Depends(get_db)):
    db_produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(db_produto)
    db.commit()
