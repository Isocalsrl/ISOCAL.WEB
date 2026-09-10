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
FRONTEND_ORIGIN=http://localhost:5173
ADMIN_SESSION_DURATION_HOURS=12
NODE_ENV=development
```

### Frontend

Copia `frontend/.env.example` como `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Los archivos `.env` contienen configuración local y no deben subirse al
repositorio.

## Ejecución local

Con Docker Desktop abierto, desde la carpeta `backend` inicia PostgreSQL,
aplica las migraciones pendientes y ejecuta los seeds locales:

```bash
cd backend
npm run db:init
```

Este comando crea el contenedor y el volumen `postgres_data` si todavía no
existen. Las siguientes ejecuciones conservan los datos y solo aplican las
migraciones que aún no estén registradas en la tabla `schema_migrations`. El
seed es idempotente: crea el administrador de prueba solo si todavía no existe.

Credenciales locales del administrador:

```text
Correo: admin@isocal.com
Contraseña: Admin123!
```

Para volver a ejecutar únicamente los seeds sobre una base ya inicializada:

```bash
npm run db:seed
```

Después, ejecuta el backend:

```bash
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
npm run db:init   # Inicia PostgreSQL, migra y carga los seeds locales
npm run db:seed   # Ejecuta nuevamente los seeds idempotentes
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

La separación de responsabilidades del backend está documentada en
[`docs/BACKEND_ARCHITECTURE.md`](docs/BACKEND_ARCHITECTURE.md).

```text
isocal/
├── backend/            # API y conexión con PostgreSQL
│   └── src/
│       ├── config/     # Variables de entorno
│       └── database/
│           ├── db.ts        # Pool de conexiones
│           ├── init.ts      # Punto de entrada de la inicialización
│           ├── migrations/  # Cambios SQL ordenados
│           └── scripts/     # Lectura y ejecución de migraciones
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
