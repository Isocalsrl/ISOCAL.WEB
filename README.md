# Isocal

Base inicial de Isocal, organizada como una aplicación web con frontend, API y
base de datos PostgreSQL.

## Tecnologías

- Frontend: React, TypeScript y Vite.
- Backend: Node.js, Express y TypeScript.
- Base de datos: PostgreSQL 17.
- Entorno local: Docker Compose.

## Requisitos

Antes de comenzar, instala:

- [Node.js](https://nodejs.org/) 22 o superior.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- npm, incluido con Node.js.

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/SebastianVegaDev/isocal.git
cd isocal
```

Instala las dependencias del backend y del frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Variables de entorno

Crea los archivos de configuración local a partir de los ejemplos incluidos:

### Backend

Copia `backend/.env.example` como `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/isocal
```

### Frontend

Copia `frontend/.env.example` como `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Los archivos `.env` contienen configuración local y no deben subirse al
repositorio.

## Ejecución local

Desde la raíz del proyecto, inicia PostgreSQL:

```bash
docker compose up -d
```

Después, abre una terminal para ejecutar el backend:

```bash
cd backend
npm run dev
```

Abre otra terminal para ejecutar el frontend:

```bash
cd frontend
npm run dev
```

Servicios disponibles:

- Frontend: <http://localhost:5173>
- API: <http://localhost:3000>
- PostgreSQL: `localhost:5433`

## Verificación de la API

Consulta el endpoint de salud:

```http
GET http://localhost:3000/health
```

Si la API y PostgreSQL están disponibles, la respuesta será:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Comandos disponibles

### Backend

```bash
npm run dev       # Ejecuta la API en modo desarrollo
npm run build     # Compila TypeScript
npm start         # Ejecuta la versión compilada
npm run test:run  # Ejecuta las pruebas una vez
```

### Frontend

```bash
npm run dev      # Inicia Vite en modo desarrollo
npm run build    # Genera la compilación de producción
npm run lint     # Ejecuta el análisis estático
npm run preview  # Previsualiza la compilación
```

## Estructura del proyecto

```text
isocal/
├── backend/            # API y conexión con PostgreSQL
│   └── src/
│       ├── config/     # Variables de entorno
│       └── database/   # Configuración de la base de datos
├── frontend/           # Aplicación React
│   └── src/
└── docker-compose.yml  # PostgreSQL para desarrollo local
```

## Detener el entorno

Para detener PostgreSQL sin eliminar sus datos:

```bash
docker compose down
```

Los datos permanecen guardados en el volumen `postgres_data`.
