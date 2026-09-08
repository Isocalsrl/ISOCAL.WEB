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
función `createAdminProductsRouter` prepara las operaciones de escritura para
conectarlas cuando el middleware de autenticación de administradores esté
implementado.

## Criterios para cambios nuevos

1. La ruta decide qué middlewares y controller se ejecutan.
2. El controller no accede directamente a la base de datos.
3. El service no depende de objetos `Request` o `Response` de Express.
4. El repository no decide códigos HTTP ni mensajes de respuesta.
5. La validación del formato ocurre antes del controller; las reglas entre
   entidades se coordinan desde el service.
6. Una migración aplicada no se modifica: cualquier cambio posterior se agrega
   como una migración nueva.
