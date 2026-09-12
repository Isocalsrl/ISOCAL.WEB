# ISOCAL.WEB

Aplicación web de ISOCAL con sitio público, catálogo, favoritos, solicitud de
cotizaciones y panel administrativo. El proyecto está preparado para ejecutarse
tanto en desarrollo con Node.js local como en un entorno completo con Docker
Compose.

## Tecnologías

- Frontend: React, TypeScript y Vite.
- Backend: Node.js, Express y TypeScript.
- Base de datos: PostgreSQL 17.
- Archivos persistentes: almacenamiento local abstraído para imágenes y PDF.
- Email de cotizaciones: Resend.
- Contenedores: Docker Compose + Nginx.

## Funcionalidades principales de la v1

- Sitio público de ISOCAL.
- Catálogo público y detalle de productos.
- Imágenes persistentes de productos.
- Favoritos y lista de cotización en el navegador.
- Solicitud pública de cotización.
- Gestión administrativa de productos y categorías.
- Gestión de cotizaciones con permisos diferenciados para `admin` y
  `super_admin`.
- Generación de PDF y envío de cotizaciones por correo.
- Historial de accesos administrativos.
- Sesiones administrativas mediante cookie `httpOnly`.
- Dockerización de PostgreSQL, backend y frontend.

## Requisitos

Para desarrollo local instala:

- Node.js 22 o superior.
- Docker Desktop.
- npm, incluido con Node.js.

Para ejecutar toda la aplicación con contenedores solo necesitas Docker con
Docker Compose.

## Opción recomendada: entorno completo con Docker

Copia el archivo raíz `.env.example` como `.env`:

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Antes del primer arranque cambia, como mínimo:

```env
POSTGRES_PASSWORD=una-contrasena-segura
BOOTSTRAP_ADMIN_NAME=Administrador ISOCAL
BOOTSTRAP_ADMIN_EMAIL=tu-correo@isocal.pe
BOOTSTRAP_ADMIN_PASSWORD=una-contrasena-segura-para-el-panel
```

Levanta la aplicación completa desde la raíz:

```bash
docker compose up -d --build
```

Docker Compose realiza el flujo completo:

1. Inicia PostgreSQL y espera su `healthcheck`.
2. Construye el backend.
3. Aplica únicamente las migraciones pendientes.
4. Crea el primer `super_admin` si se configuraron las tres variables
   `BOOTSTRAP_ADMIN_*` y todavía no existe.
5. Inicia la API y espera su `healthcheck`.
6. Construye el frontend y lo sirve con Nginx.
7. Nginx entrega React y redirige `/api/*` al backend usando la red interna de
   Docker.

Servicios disponibles por defecto:

- Aplicación completa: <http://localhost:8080>
- Healthcheck público de la API: <http://localhost:8080/health>
- PostgreSQL local: `127.0.0.1:5433`

El backend no publica su puerto `3000` al host. Solo Nginx puede acceder a él a
través de la red de Docker. PostgreSQL se publica únicamente sobre
`127.0.0.1`, evitando exponerlo directamente a la red externa.

### Persistencia

Docker mantiene dos volúmenes:

- `postgres_data`: base de datos PostgreSQL.
- `backend_storage`: imágenes de productos y documentos PDF generados.

Por tanto, ejecutar `docker compose down` no elimina información. No uses
`docker compose down -v` salvo que quieras eliminar intencionalmente la base de
datos y los archivos almacenados.

### Primer superadministrador

El bootstrap inicial es distinto al seed de desarrollo. No crea categorías,
productos ni cuentas de prueba.

Cuando el primer `super_admin` ya exista, retira o deja vacías las tres variables
`BOOTSTRAP_ADMIN_*` del `.env` y vuelve a crear el contenedor del backend:

```bash
docker compose up -d --force-recreate backend
```

El bootstrap es idempotente: si la cuenta ya existe no modifica su contraseña.

## Desarrollo local sin dockerizar frontend/backend

Instala dependencias:

```bash
cd backend
npm ci

cd ../frontend
npm ci
```

### Variables de entorno del backend

Copia `backend/.env.example` como `backend/.env`.

Configuración mínima para desarrollo:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/isocal
FRONTEND_ORIGIN=http://localhost:5173
TRUST_PROXY_HOPS=0
ADMIN_SESSION_DURATION_HOURS=12
NODE_ENV=development
FILE_STORAGE_ROOT=storage
```

`FRONTEND_ORIGIN` acepta uno o varios orígenes separados por comas.
`TRUST_PROXY_HOPS=0` es correcto cuando Express se ejecuta directamente. En el
entorno Docker se configura en `1` porque Nginx actúa como proxy.

### Variables de entorno del frontend

Copia `frontend/.env.example` como `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Inicializar PostgreSQL para desarrollo

Desde `backend`:

```bash
npm run db:init
```

`db:init` está reservado al entorno de desarrollo: inicia PostgreSQL, aplica las
migraciones y ejecuta los seeds locales. Los seeds son idempotentes.

Credenciales de desarrollo incluidas en el seed:

```text
Super admin
Correo: admin@isocal.com
Contraseña: Admin123!

Admin
Correo: developer@isocal.com
Contraseña: Developer123!
```

No se utiliza este seed durante el arranque de los contenedores de la
aplicación completa.

Para aplicar solo migraciones y el bootstrap opcional de despliegue:

```bash
npm run db:prepare
```

Después inicia backend y frontend en terminales separadas:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Servicios de desarrollo:

- Frontend: <http://localhost:5173>
- API: <http://localhost:3000>
- PostgreSQL: `localhost:5433`

## Email de cotizaciones

Para habilitar el envío real de cotizaciones configura:

```env
RESEND_API_KEY=...
EMAIL_FROM=Cotizaciones ISOCAL <cotizaciones@tu-dominio.pe>
EMAIL_REPLY_TO=ventas@isocal.pe
```

`EMAIL_FROM` debe usar un dominio/remitente autorizado por el proveedor. La app
puede generar y almacenar el PDF aunque el servicio de correo todavía no esté
configurado.

## Despliegue en VPS

Para producción cambia al menos:

```env
NODE_ENV=production
FRONTEND_ORIGIN=https://www.tu-dominio.pe
```

La cookie administrativa se marca `Secure` cuando `NODE_ENV=production`, por lo
que el acceso al panel debe publicarse mediante HTTPS.

Si existe un proxy adicional delante del Nginx del contenedor (por ejemplo,
Caddy o Nginx del host para terminar TLS), ajusta `TRUST_PROXY_HOPS` al número de
proxies confiables entre Internet y Express. Con solo el Nginx incluido en este
repositorio el valor es `1`.

Antes de considerar el despliegue productivo cerrado también deben quedar
configurados fuera del código:

- dominio y DNS;
- certificado HTTPS;
- contraseña real de PostgreSQL;
- cuenta administrativa inicial;
- credenciales de Resend y dominio de correo verificado;
- datos fiscales/comerciales usados en el PDF;
- política de backups del volumen de PostgreSQL y de `backend_storage`.

## Verificación de salud

```http
GET /health
```

Respuesta esperada cuando API y PostgreSQL están disponibles:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Comandos disponibles

### Backend

```bash
npm run dev        # Ejecuta la API en modo desarrollo
npm run build      # Compila TypeScript
npm start          # Ejecuta la versión compilada
npm run db:init    # Migraciones + seeds locales de desarrollo
npm run db:prepare # Migraciones + bootstrap opcional de despliegue
npm run db:seed    # Reejecuta seeds locales idempotentes
npm run test:run   # Ejecuta las pruebas una vez
```

### Frontend

```bash
npm run dev      # Inicia Vite en desarrollo
npm run build    # Genera el build de producción
npm run lint     # Ejecuta ESLint
npm run preview  # Previsualiza el build
```

### Docker

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose down
```

## Arquitectura

La separación de responsabilidades está documentada en:

- [`docs/BACKEND_ARCHITECTURE.md`](docs/BACKEND_ARCHITECTURE.md)
- [`docs/FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md)
- [`docs/DATABASE.md`](docs/DATABASE.md)
- [`docs/MIGRATIONS.md`](docs/MIGRATIONS.md)

```text
isocal/
├── backend/
│   ├── Dockerfile
│   ├── storage/
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── public/
│   └── src/
├── docs/
├── .env.example
└── docker-compose.yml
```
