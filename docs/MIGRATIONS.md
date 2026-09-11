# Convención de migraciones

## Regla principal

Una migración que ya pudo ejecutarse en cualquier entorno se considera
histórica: no se renombra, no se reordena y no se reutiliza para introducir un
cambio nuevo.

## Prefijos históricos

El repositorio contiene tres archivos históricos con prefijo `005`:

```text
005_create_admin_email_lower_unique_index.sql
005_create_admin_login_events.sql
005_create_admin_sessions.sql
```

Esta numeración se conserva deliberadamente. El runner actual identifica las
migraciones por nombre de archivo y contiene compatibilidad para el historial
existente, por lo que renombrarlas ahora podría provocar divergencias entre
bases ya inicializadas y entornos nuevos.

## Siguiente migración

La última migración actual es `010_create_quote_email_deliveries.sql`.
Toda migración nueva debe comenzar desde `011_...` y continuar de forma
incremental:

```text
011_descripcion_del_cambio.sql
012_descripcion_del_cambio.sql
013_descripcion_del_cambio.sql
```

No se debe volver a utilizar un número ya existente.

## Flujo recomendado

1. Crear un archivo nuevo en `backend/src/database/migrations/`.
2. Hacer el cambio idempotente cuando corresponda (`IF NOT EXISTS`, guards o
   verificaciones explícitas).
3. Ejecutar `npm run db:init` sobre una base nueva.
4. Ejecutar `npm run db:init` una segunda vez para comprobar idempotencia.
5. Validar también una base que ya tenga las migraciones anteriores aplicadas.
