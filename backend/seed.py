import os
import sqlite3
import pandas as pd

DB_PATH = "ecommerce.db"
conn = sqlite3.connect(DB_PATH)
CSV_DIR = os.path.dirname(os.path.abspath(__file__))

table = "fat_avaliacoes_pedidos"
csv_file = "fat_avaliacoes_pedidos.csv"

path = os.path.join(CSV_DIR, csv_file)

if os.path.exists(path):
    print(f"Lendo {csv_file}...")
    df = pd.read_csv(path)
    
    df = df.drop_duplicates(subset=['id_avaliacao'])
    
    try:
        df.to_sql(table, con=conn, if_exists="append", index=False, chunksize=1000)
        print(f"[OK] {table}: {len(df)} linhas inseridas com sucesso!")
    except Exception as e:
        print(f"\n[ERRO] {table}: {e}")
else:
    print(f"Arquivo {csv_file} não encontrado.")

conn.close()
print("Finalizado!")