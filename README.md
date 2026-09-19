# ISOCAL.WEB

Aplicación full stack para el sitio público y la administración de ISOCAL. Incluye catálogo, blog, favoritos, lista de cotización, solicitudes por correo, herramientas técnicas, asistente público y panel administrativo.

El repositorio usa **npm workspaces** para tratar `backend/` y `frontend/` como una sola aplicación durante desarrollo, sin perder la independencia necesaria para construir cada contenedor en producción.

## Stack

- Frontend: React 19, TypeScript, Vite y React Router.
- Backend: Node.js 22, Express 5 y TypeScript.
- Base de datos: MariaDB/MySQL.
- Archivos: almacenamiento local persistente para imágenes.
- Email: Resend.
- Cotizaciones: PDF automático al cliente; copia interna opcional mediante `QUOTATION_INTERNAL_EMAIL`, sin aprobación administrativa.
- Infraestructura: Docker Compose y Nginx.

## Estructura

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   │   ├── commands/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   └── shared/
│   └── tests/
├── frontend/
│   └── src/
│       ├── app/
│       ├── features/
│       └── shared/
├── docs/
├── scripts/
├── docker-compose.yml
└── package.json
```

La explicación de las decisiones está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y el mapa práctico para ubicar cambios en [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md).

## Desarrollo local

### 1. Requisitos

- Node.js 22 o superior.
- npm.
- Docker Desktop o Docker Engine con Compose.

### 2. Instalar dependencias

Desde la raíz:

```bash
npm install
```

El workspace instala las dependencias de backend y frontend desde un único punto de entrada.

### 3. Variables de entorno

El proyecto usa un único archivo de entorno en la raíz:

```powershell
Copy-Item .env.example .env
```

Completa ese archivo antes de arrancar. El backend y Vite leen la misma configuración; no existen `.env` adicionales dentro de `backend/` o `frontend/`.

### 4. Levantar todo

```bash
npm run dev
```

Ese comando:

1. inicia MariaDB/MySQL con Docker;
2. espera el healthcheck;
3. ejecuta migraciones pendientes;
4. crea el `super_admin` inicial desde `BOOTSTRAP_SUPER_ADMIN_*` si todavía no existe;
5. restaura el catálogo y sus imágenes si falta algún binario del almacenamiento;
6. ejecuta el seed de contenido;
7. inicia backend y frontend en paralelo.

Servicios:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- MariaDB/MySQL: `localhost:3307`

No se publican credenciales de acceso en este repositorio. La cuenta inicial se configura únicamente desde el `.env` local mediante `BOOTSTRAP_SUPER_ADMIN_NAME`, `BOOTSTRAP_SUPER_ADMIN_EMAIL` y `BOOTSTRAP_SUPER_ADMIN_PASSWORD`. A partir de ahí, el superadministrador crea las cuentas de administradores desde el panel.

## Comandos principales

```bash
npm run dev                 # MariaDB/MySQL + migraciones + seed + backend + frontend
npm run dev:app             # backend + frontend, sin tocar la base
npm run dev:fresh           # reinicia solo MariaDB/MySQL, conserva imágenes/PDF, migra, seed y levanta la app
npm run build               # build backend + frontend
npm run typecheck           # TypeScript en ambos workspaces
npm run lint                # ESLint del frontend
npm run test                # tests backend + frontend
npm run check:architecture  # valida fronteras entre módulos/features
npm run check               # arquitectura + typecheck + lint + test + build

npm run db:up               # inicia MariaDB/MySQL
npm run db:down             # detiene MariaDB/MySQL
npm run db:migrate          # aplica migraciones pendientes
npm run db:seed             # seed completo de desarrollo
npm run db:seed:portfolio   # solo catálogo oficial
npm run db:setup            # MariaDB/MySQL + migraciones + seed
npm run db:reset            # reinicia solo el volumen MariaDB/MySQL; conserva backend_storage

npm run docker:up           # build + migraciones + seed + arranque completo con Docker Compose
npm run docker:down
npm run docker:logs
```

El directorio raíz `scripts/` contiene el orquestador de desarrollo y el reinicio seguro de MariaDB/MySQL. El segundo elimina únicamente el volumen de base de datos y nunca el volumen persistente de imágenes/PDF.

## Seeds e imágenes

Los seeds del catálogo y blog incluyen sus assets dentro de `backend/src/database/seeds/assets/`. Son idempotentes: al ejecutar `npm run dev` no reemplazan una imagen subida por un administrador si el archivo actual sigue existiendo. Si la base apunta a un archivo que falta físicamente, el seed restaura únicamente ese binario desde el asset inicial.

El almacenamiento runtime vive en `FILE_STORAGE_ROOT` durante desarrollo y en el volumen Docker `isocal_backend_storage` durante despliegue. `npm run db:reset` no elimina ese almacenamiento.

## Docker

Para levantar el stack completo como entorno de despliegue:

```bash
cp .env.example .env
npm run docker:up
```

La aplicación queda disponible en `http://localhost:8080` por defecto.

En Docker, el backend espera a MariaDB/MySQL, ejecuta migraciones, garantiza el `super_admin` configurado y carga catálogo/blog antes de iniciar la API. No existen cuentas de desarrollo hardcodeadas: la única cuenta inicial proviene de `BOOTSTRAP_SUPER_ADMIN_*` y solo se crea cuando todavía no existe.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Mapa práctico del proyecto](docs/PROJECT_MAP.md)
- [Desarrollo](docs/DEVELOPMENT.md)
- [Base de datos y seeds](docs/DATABASE.md)
- [Despliegue](docs/DEPLOYMENT.md)
- [Asistente virtual](docs/ASSISTANT.md)

## Hostinger Business Web Hosting

Esta versión usa MariaDB/MySQL y puede desplegarse como una única aplicación Node.js: el build raíz incorpora el frontend compilado dentro del backend Express. Consulta `docs/HOSTINGER_BUSINESS_DEPLOYMENT.md` para variables, build y arranque en hPanel.
