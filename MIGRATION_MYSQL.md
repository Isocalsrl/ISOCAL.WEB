# Migración de ISOCAL a MariaDB/MySQL

Esta versión reemplaza la dependencia de PostgreSQL del proyecto por MariaDB/MySQL para poder desplegar ISOCAL en Hostinger Business Web Hosting.

## Cambios principales

- Driver del backend: `pg` -> `mysql2/promise`.
- Pool, conexiones y transacciones adaptados a MySQL/MariaDB.
- Todas las migraciones SQL reescritas para InnoDB/utf8mb4.
- Reemplazados `RETURNING`, `ON CONFLICT`, `ANY(...)`, casts `::`, índices parciales, búsqueda full-text de PostgreSQL y advisory locks.
- Seeds de catálogo/blog convertidos e idempotentes.
- Manejo de errores de claves únicas y foráneas adaptado a errores MySQL.
- Docker local actualizado a MariaDB 11.4 en el puerto 3307.
- Producción acepta tanto `DB_*` (formato recomendado por Hostinger) como `DATABASE_*`.
- El build raíz empaqueta React dentro del backend Express para desplegar una sola aplicación Node.js.
- En producción el frontend usa `/api` en el mismo dominio por defecto.
- `npm start` prepara migraciones, superadministrador y contenido antes de arrancar la API.

## Validaciones realizadas en este entorno

- Escaneo de referencias ejecutables exclusivas de PostgreSQL: sin coincidencias.
- Sintaxis TypeScript/TSX validada en 319 archivos.
- Sintaxis de scripts JS/MJS validada.
- Verificador de fronteras de arquitectura: aprobado.
- JSON de configuración/package files: válido.
- Validador de variables de entorno: aprobado con `.env.example`.

## Límite de esta entrega

El ZIP fuente no contiene un dump de la base PostgreSQL ni acceso a la base actualmente desplegada. Por eso esta entrega migra **el código, esquema, migraciones y seeds** para crear/usar MariaDB/MySQL, pero no puede copiar registros de una base PostgreSQL externa que no fue proporcionada.

Si existen datos de producción que deban conservarse (admins, cotizaciones, blog, productos editados, etc.), hay que exportarlos de PostgreSQL y hacer una migración de datos antes del corte definitivo.

Consulta `docs/HOSTINGER_BUSINESS_DEPLOYMENT.md` para los pasos de despliegue.
