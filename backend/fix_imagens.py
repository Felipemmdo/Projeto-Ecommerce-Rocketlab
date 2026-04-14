import sqlite3

conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

#Categorias que vieram sem foto
novas_imagens = [
    ("moveis_cozinha_area_de_servico_jantar_e_jardim", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500"),
    ("construcao_ferramentas_construcao", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"),
    ("construcao_ferramentas_seguranca", "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500"),
    ("construcao_ferramentas_iluminacao", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500"),
    ("construcao_ferramentas_ferramentas", "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500"),
    ("construcao_ferramentas_jardim", "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=500"),
    ("casa_conforto_2", "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500")

]

for cat, link in novas_imagens:
    try:
        # Tenta inserir a imagem para a categoria
        cursor.execute("INSERT INTO dim_categoria_imagens (categoria, link) VALUES (?, ?)", (cat, link))
    except Exception as e:
        # Se existir, atualiza
        cursor.execute("UPDATE dim_categoria_imagens SET link = ? WHERE categoria = ?", (link, cat))

conn.commit()
conn.close()
print("Imagens corrigidas com sucesso!")