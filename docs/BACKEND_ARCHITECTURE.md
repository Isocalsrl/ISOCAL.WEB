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
│   ├── products.read.repository.ts
│   ├── products.update.repository.ts
│   └── products.repository.constants.ts
├── services/
│   ├── products.normalizer.ts
│   └── products.service.ts
└── validators/
    ├── products.body.validator.ts
    └── products.business.validator.ts
```

Las rutas públicas exponen únicamente la consulta de productos activos. La
función `createAdminProductsRouter` expone las operaciones de escritura bajo
`/api/admin/products` y exige una sesión válida de administrador.

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

El seed mantiene el mismo límite de capas: el script contiene únicamente los
datos locales, el service valida y cifra la contraseña, y el repository realiza
el `INSERT`. Tanto `db:init` como `db:seed` lo ejecutan de forma idempotente.

## Criterios para cambios nuevos

1. La ruta decide qué middlewares y controller se ejecutan.
2. El controller no accede directamente a la base de datos.
3. El service no depende de objetos `Request` o `Response` de Express.
4. El repository no decide códigos HTTP ni mensajes de respuesta.
5. La validación del formato ocurre antes del controller; las reglas entre
   entidades se coordinan desde el service.
6. Una migración aplicada no se modifica: cualquier cambio posterior se agrega
   como una migración nueva.
