Sistema de Gerenciamento de E-Commerce (Visagio Rocket Lab 2026)

Esta é uma aplicação Fullstack desenvolvida para o gerenciamento de produtos de um E-Commerce. O sistema permite ao usuário navegar por um catálogo, buscar itens específicos, gerenciar o inventário (CRUD) e visualizar métricas de desempenho como total de vendas e média de avaliações.

**Stack Tecnológica:**
- **Frontend:** React + Vite + TypeScript
- **Backend:** FastAPI (Python)
- **Banco de Dados:** SQLite (SQLAlchemy ORM)

---

## ⚙️ Pré-requisitos

- Python 3.11+
- Node.js 18+

---

## 🚀 Como executar o Backend

1. Navegue até a pasta do backend e crie um ambiente virtual:
```bash
cd backend
python -m venv venv

2. Ative o ambiente virtual:

Windows: venv\\Scripts\\activate

Linux/Mac: source venv/bin/activate

3. Instale as dependências:

pip install -r requirements.txt

4. Certifique-se de que os arquivos .csv originais estejam na raiz da pasta backend/.

5. Prepare o banco de dados e as tabelas:

python criar_banco.py

Popule o banco e aplique as correções visuais:

python seed.py
python fix_imagens.py

7. Inicie o servidor da API: uvicorn app.main:app --reload

A API estará disponível em: http://localhost:8000

Documentação Swagger: http://localhost:8000/docs

🎨 Como executar o Frontend: 

1 . Abra um novo terminal na pasta do frontend:

cd frontend

2 . Instale as dependências do Node:

npm install

3. Inicie o servidor de desenvolvimento:

npm run dev

O frontend estará disponível em: http://localhost:5173

Funcionalidades:

Catálogo de Produtos: Visualização em grid com renderização inteligente de imagens.

Busca e Filtros: Pesquisa por nome e filtragem por categorias dinâmicas.

Detalhes Avançados: Exibição de medidas, total de vendas e média de avaliações calculada em tempo real.

CRUD: Adicionar, editar e remover produtos com persistência no banco de dados.

Resiliência de Dados: Scripts de carga (seed.py) preparados para grandes volumes de dados.

Estrutura do Projeto:

backend/
 ├── app/
 │    ├── models/       # Definições das tabelas SQLAlchemy
 │    ├── routers/      # Endpoints da API (Lógica de rotas)
 │    ├── schemas/      # Validação de dados com Pydantic
 │    ├── database.py   # Configuração e conexão do banco
 │    └── main.py       # Inicialização do FastAPI
 ├── criar_banco.py     # Script para gerar o arquivo .db
 ├── seed.py            # Importação massiva dos CSVs
 ├── fix_imagens.py     # Ajustes de links de imagens quebrados
 └── requirements.txt

frontend/
 ├── src/
 │    ├── pages/        # Telas (Catálogo, Detalhes, Formulários)
 │    ├── components/   # Elementos reutilizáveis
 │    └── services/     # Integração com a API (Axios/Fetch)
 ├── vite.config.ts
 └── package.json

