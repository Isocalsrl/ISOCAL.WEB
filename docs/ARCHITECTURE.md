# Arquitectura de ISOCAL

## 1. Objetivo

ISOCAL usa una arquitectura modular pragmática. El objetivo no es maximizar la cantidad de capas, sino conseguir tres cosas:

1. que una funcionalidad pueda seguirse de principio a fin sin adivinar dónde vive cada responsabilidad;
2. que los módulos no dependan de detalles internos de otros módulos;
3. que un desarrollador junior pueda hacer cambios seguros sin necesitar conocer todo el sistema.

La regla principal es: **separa responsabilidades cuando la separación protege una frontera real; no crees archivos solo para parecer “enterprise”.**

## 2. Mapa de alto nivel

```text
ISOCAL.WEB
├── backend/                 API, reglas de negocio, PostgreSQL, archivos y email
├── frontend/                aplicación React pública + panel administrativo
├── docs/                    documentación viva del sistema
├── scripts/                 automatización del workspace
├── docker-compose.yml       stack local/de despliegue
└── package.json             comandos comunes mediante npm workspaces
```

Para saber rápidamente dónde realizar un cambio concreto, consulta [PROJECT_MAP.md](PROJECT_MAP.md).

## 3. Backend

### 3.1 Capas del flujo HTTP

Para una operación normal:

```text
HTTP request
    ↓
route
    ↓
controller
    ↓
service
    ↓
repository
    ↓
PostgreSQL
```

Responsabilidades:

- **route**: URL, método HTTP y middleware aplicable;
- **controller**: traduce HTTP a una llamada del caso de uso y construye la respuesta;
- **service**: reglas de negocio, autorización de negocio, coordinación y transacciones;
- **repository**: SQL y persistencia;
- **mapper**: convierte filas/estructuras de persistencia a modelos que consume el módulo;
- **validation**: valida la forma del input;
- **types**: contratos propios del módulo.

Un controller no debe contener SQL ni decisiones de negocio. Un repository no debe decidir permisos. Un route no debe transformarse en un service improvisado.

### 3.2 Organización por módulo

```text
backend/src/modules/
├── auth/
├── blog/
├── categories/
├── products/
├── quotes/
└── requests/
```

Cada módulo mantiene juntos los archivos necesarios para entender su dominio. No se crean subcarpetas `services/`, `repositories/` o `validators/` si solo añaden navegación sin aislar nada.

### 3.3 Dependencias entre módulos

Una dependencia entre módulos puede existir cuando representa una relación real del negocio, pero debe ocurrir en una frontera estable.

**Permitido:**

```text
categories.service -> products.service
requests.service   -> quotes.service
```

**Evitar:**

```text
categories.repository -> products.mapper
categories.repository -> products.repository
products.types        -> categories.repository
```

La razón es sencilla: un módulo puede consumir el comportamiento público de otro módulo, pero no debe conocer cómo ese módulo organiza su persistencia interna.

`scripts/check-architecture.mjs` valida automáticamente varias de estas fronteras.

### 3.4 Auth y autorización

Todo lo específico de autenticación administrativa vive en `modules/auth`:

- cookies y sesiones;
- login;
- middleware de autenticación;
- autorización por rol;
- historial de accesos;
- bootstrap del superadministrador.

El tipo transversal `AdminRole` vive en `shared/auth/adminRole.ts`, porque Products y Categories necesitan conocer roles sin depender del módulo Auth completo.

### 3.5 Middlewares globales

`backend/src/middlewares` contiene únicamente middleware HTTP reutilizable que no pertenece a un dominio concreto:

- manejo global de errores;
- rate limiting genérico;
- validación genérica del body.

Si un middleware existe solamente para Blog, Products o Auth, debe vivir con ese módulo.

### 3.6 Shared

`backend/src/shared` contiene piezas reutilizadas por más de un módulo:

```text
shared/
├── auth/        contratos mínimos transversales
├── email/       cliente, proveedor y servicio de correo
├── errors/      errores de aplicación
├── http/        contratos de respuesta HTTP
├── storage/     persistencia binaria
├── types/       tipos realmente compartidos
└── utils/       utilidades pequeñas sin dominio
```

`shared/` **nunca depende de `modules/`**. Si eso ocurre, la dependencia está invertida.

No muevas código a `shared` porque “quizás se reutilice”. Muévelo cuando ya exista una necesidad transversal clara.

## 4. Requests y Quotes

Estas dos áreas se mantienen separadas deliberadamente:

- `requests` representa la entrada pública: consulta, reclamo o solicitud de cotización;
- `quotes` representa la cotización comercial persistida: items, PDF y entrega por correo.

Flujo de una cotización:

```text
POST /api/requests
    ↓
requests.controller
    ↓
requests.service
    ↓
quotes.service
    ├── quotes.repository
    ├── documents/commercialQuotePdf
    └── shared/email
```

Esto evita que el módulo de Requests termine siendo responsable de todo el ciclo de vida comercial.

## 5. Base de datos

```text
backend/src/database/
├── commands/       entrypoints ejecutables desde npm/Docker
├── migrations/     evolución inmutable del esquema
├── seeds/          contenido reproducible
├── db.ts           pool PostgreSQL
├── migrationFiles.ts
├── migrationRunner.ts
└── transaction.ts
```

Las migraciones aplicadas son inmutables. La numeración histórica contiene nombres repetidos alrededor de `005`; no deben renombrarse porque `schema_migrations` registra el filename. Consulta [DATABASE.md](DATABASE.md) antes de crear una migración.

## 6. Frontend

### 6.1 Capas principales

```text
frontend/src/
├── app/          composición global y routing
├── config/       configuración de runtime
├── features/     funcionalidades del producto
└── shared/       UI e infraestructura reutilizable
```

### 6.2 Anatomía de una feature

Una feature solo crea las carpetas que necesita:

```text
feature/
├── api/          acceso HTTP
├── components/   UI propia
├── context/      estado compartido de la feature
├── hooks/        coordinación de estado/efectos
├── model/        lógica pura y modelos
├── pages/        composición de pantallas
├── storage/      localStorage/sessionStorage
├── styles/       estilos propios
└── types/        tipos propios
```

No es obligatorio tenerlas todas.

### 6.3 Reglas de dependencia

- `app` puede importar `features` y `shared`;
- `shared` no puede importar `features` ni `app`;
- una feature no puede importar `app`;
- una feature puede usar otra feature cuando existe una relación funcional explícita;
- los agregadores (`assistant`, `search`, `public-site`) pueden leer datos públicos de varias features porque esa es precisamente su responsabilidad;
- componentes visuales no deben realizar HTTP directamente si ya existe una capa `api`/hook para esa feature.

El objetivo no es eliminar todas las dependencias entre features. El objetivo es que sean **direccionales, explicables y visibles**.

## 7. Public Site y CSS

`features/public-site` funciona como shell de composición de la experiencia pública. `PublicLayout` carga el índice de estilos públicos porque varias features se integran en la misma superficie visual y el orden de cascada es relevante.

Los nombres de hojas de estilo deben describir su responsabilidad. Se evitaron nombres como `*-override.css`, `*-polish.css` o `final-*` porque no explican qué parte de la UI poseen.

Ejemplos actuales:

- `products/styles/catalog-core.css`: base del catálogo;
- `products/styles/catalog-layout.css`: presentación detallada del catálogo;
- `products/styles/product-detail.css`: detalle/modal de producto;
- `public-site/styles/components/site-integration.css`: reglas de integración que cruzan varias zonas de la experiencia pública.

`site-integration.css` es una excepción consciente. No debe convertirse en el lugar donde se agregan arreglos arbitrarios. Si una regla pertenece claramente a una feature o sección, debe ir allí.

## 8. Workspace y scripts

El `package.json` raíz coordina backend y frontend mediante npm workspaces.

`scripts/` se conserva porque contiene automatización concreta del repositorio:

- `dev.mjs`: levanta backend y frontend juntos;
- `reset-db.mjs`: reinicia solo PostgreSQL local;
- `validate-env.mjs`: valida variables antes de comandos sensibles;
- `check-architecture.mjs`: impide dependencias arquitectónicas prohibidas.

No se añade una herramienta de monorepo más pesada mientras npm workspaces cubra estas necesidades.

## 9. Qué no estamos introduciendo

En el tamaño actual del proyecto no aportan suficiente valor:

- contenedor de dependency injection;
- interfaces para cada repository;
- `domain/application/infrastructure` en cada CRUD;
- repository genérico;
- event bus interno;
- CQRS;
- Redux global por defecto;
- Nx/Turborepo solo para ejecutar dos workspaces.

Si el sistema crece hasta que una de esas herramientas resuelva un problema real, se reconsidera entonces.

## 10. Regla para decidir dónde va código nuevo

Hazte estas preguntas en orden:

1. ¿Pertenece claramente a una feature/módulo? → colócalo allí.
2. ¿Lo usan dos o más módulos sin pertenecer a ninguno? → considera `shared`.
3. ¿Es composición global/routing? → `app`.
4. ¿Es infraestructura de base de datos? → `database`.
5. ¿Es automatización del repositorio? → `scripts`.
6. ¿Solo estás creando una capa porque el nombre suena profesional? → probablemente no la necesitas.
