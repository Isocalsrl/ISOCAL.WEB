# Arquitectura del backend

## Objetivo

Mantener un flujo predecible para que cada archivo tenga una responsabilidad
clara y los módulos puedan crecer sin mezclar HTTP, negocio y PostgreSQL.

## Flujo de una solicitud

```text
Ruta → middleware de validación → controller → service → repository → PostgreSQL
                                      ↓
                                  normalizer
```

- **Routes:** declaran URL, método HTTP y middlewares.
- **Controllers:** traducen la solicitud HTTP a argumentos del caso de uso y
  construyen la respuesta. No contienen consultas SQL ni reglas de negocio.
- **Services:** coordinan el caso de uso, normalizan los datos y aplican reglas
  de negocio.
- **Validators:** validan el cuerpo HTTP o reglas que requieren consultar otros
  recursos.
- **Repositories:** son la única capa que conoce las consultas SQL.
- **Mappers:** convierten filas de PostgreSQL al modelo usado por la aplicación.
- **Types:** describen entidades y datos de entrada del módulo.

## Módulo de productos

```text
products/
├── products.controller.ts
├── products.mapper.ts
├── products.routes.ts
├── products.types.ts
├── repositories/
│   ├── products.create.repository.ts
│   ├── products.image.repository.ts
│   ├── products.read.repository.ts
│   ├── products.update.repository.ts
│   └── products.repository.constants.ts
├── services/
│   ├── productImage.service.ts
│   ├── products.normalizer.ts
│   ├── products.permissions.ts
│   └── products.service.ts
└── validators/
    ├── products.body.validator.ts
    ├── products.business.validator.ts
    └── products.image.validator.ts
```

Las rutas públicas exponen únicamente la consulta de productos activos. La
función `createAdminProductsRouter` expone la consulta y escritura privada bajo
`/api/admin/products` y exige una sesión válida. El service decide el alcance
según el rol autenticado: `admin` recibe registros activos y `super_admin`
recibe el catálogo completo.

## Autenticación de administradores

```text
auth/
├── auth.controller.ts
├── auth.cookie.ts
├── auth.mapper.ts
├── auth.routes.ts
├── auth.types.ts
├── repositories/
│   ├── auth.create.repository.ts
│   ├── auth.login-event.repository.ts
│   ├── auth.read.repository.ts
│   └── auth.session.repository.ts
├── services/
│   ├── auth.normalizer.ts
│   ├── auth.seed.service.ts
│   └── auth.service.ts
└── validators/
    └── auth.body.validator.ts
```

El login genera un token opaco aleatorio. Solo su hash SHA-256 se guarda en
`admin_sessions`; el token original se entrega mediante una cookie `HttpOnly`.
El middleware consulta la sesión, verifica su expiración y confirma que el
administrador siga activo antes de permitir acceso a las rutas privadas.

La autorización tiene dos niveles. `admin` puede crear, editar y desactivar
contenido activo. `super_admin` también puede consultar, modificar y reactivar
contenido inactivo. Estas reglas se aplican en los services; los permisos no
dependen de que el frontend oculte una acción.

Cada intento de login válido en formato genera un evento persistente con correo,
resultado, fecha, IP y agente de usuario. Los accesos correctos se registran en
la misma transacción que crea la sesión. El endpoint
`GET /api/admin/auth/login-history` está protegido además por el middleware de
rol y solo responde a `super_admin`.

El seed mantiene el mismo límite de capas: el script contiene únicamente los
datos locales de ambos roles, el service valida y cifra las contraseñas, y el
repository realiza el `INSERT`. Tanto `db:init` como `db:seed` lo ejecutan de
forma idempotente.

## Criterios para cambios nuevos

1. La ruta decide qué middlewares y controller se ejecutan.
2. El controller no accede directamente a la base de datos.
3. El service no depende de objetos `Request` o `Response` de Express.
4. El repository no decide códigos HTTP ni mensajes de respuesta.
5. La validación del formato ocurre antes del controller; las reglas entre
   entidades se coordinan desde el service.
6. Una migración aplicada no se modifica: cualquier cambio posterior se agrega
   como una migración nueva.

## Módulos futuros

No se crean controllers, services, repositories o routes vacíos para reservar
features futuras. Un módulo entra al árbol cuando existe al menos un caso de uso
real y su primera ruta puede respetar el flujo definido arriba. Las features
planificadas se mantienen en issues o documentación, no como archivos fuente
vacíos que aparenten una implementación inexistente.

## Transacciones

Las transacciones de casos de uso normales se ejecutan mediante
`database/transaction.ts`. El helper centraliza adquisición/liberación del
cliente y `BEGIN`/`COMMIT`/`ROLLBACK`, mientras el callback conserva el SQL en
el repository o la coordinación explícita del service.

El runner de migraciones es una excepción intencional: administra su propia
conexión, advisory lock y ciclo transaccional porque forma parte del arranque de
infraestructura y no de un caso de uso HTTP.

## Productos e imágenes

`products.service.ts` coordina el caso de uso. Las reglas de autorización
propias del producto viven en `products.permissions.ts` y el almacenamiento
binario/validación de la imagen en `productImage.service.ts`. El repository
continúa siendo responsable de persistir los metadatos de la imagen en
PostgreSQL.

La compensación de almacenamiento sigue en el service: si la transacción de
base de datos falla después de guardar un binario, el archivo recién creado se
elimina para no dejar residuos sin referencia.

## Cotizaciones administrativas

El módulo de cotizaciones creció en varios subdominios y sus mutaciones se
separan por motivo de cambio:

```text
repositories/
├── quotes.status.repository.ts       cambios de estado
├── quotes.pricing.repository.ts      precios y recálculos
├── quotes.commercial.repository.ts   condiciones comerciales
├── quotes.events.repository.ts       historial/auditoría
├── quotes.document.repository.ts     documentos generados
└── quotes.delivery.repository.ts     intentos de correo
```

`quotes.admin.update.repository.ts` se conserva como barrel de compatibilidad;
no debe recibir nueva lógica. Los services nuevos importan directamente el
repository dueño de la responsabilidad.

Los tipos de cotización siguen pudiendo importarse desde `quotes.types.ts`,
pero internamente están agrupados en `quotes/types/` por núcleo, solicitud,
pricing y vistas administrativas. Esto mantiene una API de tipos estable sin
volver a concentrar todos los contratos en un archivo monolítico.
