# Base de datos y seeds

## PostgreSQL

ISOCAL usa PostgreSQL 17. En desarrollo Docker publica el servicio en `localhost:5433` para evitar conflictos frecuentes con instalaciones locales en `5432`.

## Migraciones

Las migraciones viven en:

```text
backend/src/database/migrations/
```

El runner:

1. crea `schema_migrations` cuando hace falta;
2. adquiere un advisory lock;
3. ordena los archivos por nombre;
4. ejecuta únicamente migraciones pendientes;
5. ejecuta cada migración dentro de una transacción;
6. registra el filename aplicado.

## Regla crítica: migraciones inmutables

Existen migraciones históricas con numeración repetida alrededor de `005`. **No las renombres.** El filename es parte del historial guardado en `schema_migrations`, y `migrationRunner.ts` incluye compatibilidad con nombres usados por versiones anteriores.

Para una migración nueva:

- busca el prefijo numérico más alto existente;
- usa el siguiente número libre;
- usa un nombre descriptivo;
- no reutilices prefijos históricos.

Ejemplo:

```text
012_add_quote_status_history.sql
```

## Comandos

```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run db:seed:portfolio
npm run db:reset
```

`db:reset` reinicia el volumen PostgreSQL local, pero conserva el almacenamiento persistente de archivos.

## Seed de desarrollo

Fuera de producción, `db:seed`:

1. crea de forma idempotente el `super_admin` configurado mediante `BOOTSTRAP_SUPER_ADMIN_*` cuando esas variables existen;
2. carga/restaura el catálogo y sus assets iniciales;
3. carga los artículos iniciales del blog y sus portadas.

No hay usuarios de desarrollo hardcodeados.

## Seeds de contenido

### Portafolio

Datos:

```text
backend/src/database/seeds/portfolio.data.json
```

Assets:

```text
backend/src/database/seeds/assets/portfolio/
```

El seed conserva una imagen vigente. Si la base referencia un binario que ya no existe físicamente, puede restaurarlo desde el asset inicial.

### Blog

Definición:

```text
backend/src/database/seeds/blog.seed.ts
```

Portadas:

```text
backend/src/database/seeds/assets/blog/
```

Los seeds son idempotentes y no deben reemplazar contenido administrado que siga vigente.

## Producción

El contenedor ejecuta primero `db:prepare`:

```text
migraciones -> bootstrap idempotente del super_admin
```

Después ejecuta `db:seed`. Con `NODE_ENV=production`, ese comando ejecuta únicamente los seeds de contenido (portafolio/blog); la cuenta inicial ya fue gestionada por `db:prepare`.

`BOOTSTRAP_SUPER_ADMIN_NAME`, `BOOTSTRAP_SUPER_ADMIN_EMAIL` y `BOOTSTRAP_SUPER_ADMIN_PASSWORD` deben configurarse juntos para el primer despliegue. Un arranque posterior no reemplaza la contraseña de una cuenta existente.
