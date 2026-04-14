from app.database import engine, Base
import app.models 

# Importa todos os modelos para que o SQLAlchemy reconheça as tabelas
# Ajuste o caminho do import se o seu arquivo de modelos se chamar diferente


print("Criando banco de dados e tabelas")
Base.metadata.create_all(bind=engine)
print("Banco de dados criado com sucesso")