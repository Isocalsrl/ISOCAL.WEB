# Despliegue

## Docker Compose

El stack incluye:

- PostgreSQL 17;
- backend Node/Express;
- frontend compilado y servido por Nginx.

Configura `.env` desde `.env.example` y ejecuta:

```bash
npm run docker:up
```

La aplicación se publica en `WEB_HTTP_PORT`, por defecto `8080`.

## Arranque del backend

Antes de iniciar el servidor, el contenedor ejecuta:

```text
prepare-deployment -> migraciones -> creación idempotente del super_admin inicial -> seed -> server
```

El arranque requiere `BOOTSTRAP_SUPER_ADMIN_NAME`, `BOOTSTRAP_SUPER_ADMIN_EMAIL` y `BOOTSTRAP_SUPER_ADMIN_PASSWORD` configurados juntos. La contraseña solo se usa para crear la cuenta si todavía no existe; un arranque posterior no la sobrescribe. No existen cuentas de desarrollo hardcodeadas. Después del primer acceso, rota la contraseña inicial y conserva los secretos únicamente en el entorno del servidor.

## Persistencia

Docker Compose declara:

- `postgres_data`: datos PostgreSQL;
- `backend_storage`: imágenes y archivos persistentes del backend.

`docker compose down` conserva ambos volúmenes. `docker compose down -v` los elimina.

## Red

El backend no publica directamente el puerto 3000 al host. Nginx actúa como entrada HTTP y reenvía `/api/*` y `/health` al backend dentro de la red de Compose.

PostgreSQL se publica en `127.0.0.1` para tareas locales de administración, no sobre todas las interfaces.

## Producción

Como mínimo configura:

```env
NODE_ENV=production
CORS_ALLOWED_ORIGINS=https://tu-dominio
DATABASE_PASSWORD=una-contrasena-fuerte
BOOTSTRAP_SUPER_ADMIN_NAME=Superadministrador
BOOTSTRAP_SUPER_ADMIN_EMAIL=admin@tu-dominio
BOOTSTRAP_SUPER_ADMIN_PASSWORD=una-contrasena-inicial-fuerte
RESEND_API_KEY=...
EMAIL_FROM=...
EMAIL_REPLY_TO=ventas@tu-dominio
QUOTATION_INTERNAL_EMAIL=ventas@tu-dominio  # opcional; vacío = solo se envía al cliente
```

También debes resolver fuera del repositorio:

- DNS;
- HTTPS;
- backups de PostgreSQL;
- backups de `backend_storage`;
- dominio verificado para correo;
- rotación de credenciales;
- monitoreo y logs del VPS.

Cuando `NODE_ENV=production`, la cookie administrativa se marca `Secure`, por lo que el panel debe publicarse bajo HTTPS.
