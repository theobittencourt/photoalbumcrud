Galeria de álbuns de fotos com React e .NET Core.

## Stack

- React + Vite
- .NET Core 10
- PostgreSQL
- Dapper ORM
- JWT + BCrypt

## Rodando localmente

**Pré-requisitos:** Node.js 18+, .NET SDK, PostgreSQL rodando

### Backend

```bash
cd backend/PhotoAlbumAPI
```

Edite `appsettings.json` com as credenciais do seu PostgreSQL:

```json
"DefaultConnection": "Host=localhost;Port=5432;Database=photoalbum;Username=postgres;Password=sua_senha"
```

Crie o banco executando o script `database.sql` no pgAdmin ou o script na mao pelo pg admin, heidisql ou outros.

```bash
dotnet run
```

Roda em `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Roda em `http://localhost:5173`

## Funcionalidades

- Autenticação com JWT
- CRUD de álbuns
- Upload e leitura de fotos no AWS S3
- Visualização em grid e tabela
- Cada usuário vê apenas seus próprios álbuns
