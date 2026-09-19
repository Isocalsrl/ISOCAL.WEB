# Despliegue en Hostinger Business Web Hosting

ISOCAL está preparado para ejecutarse como una aplicación Node.js/Express con MariaDB/MySQL. El build raíz compila React y backend, y copia el frontend a `backend/dist/public`; Express lo sirve junto con `/api`, por lo que puede desplegarse como una sola Web App de Node.js.

## 1. Crear la base de datos

En hPanel crea una base de datos desde **Websites → Dashboard → Databases → Management** y conserva nombre, usuario y contraseña.

Variables recomendadas en Hostinger:

```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DATABASE_CONNECTION_LIMIT=10
DATABASE_SSL=false
```

También se aceptan los nombres `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` y `DATABASE_NAME`.

Configura además todas las variables de empresa, pagos, email y `BOOTSTRAP_SUPER_ADMIN_*` requeridas por la aplicación. No subas un `.env` real al repositorio.

## 2. Configuración de la Web App

- Node.js: 22.x
- Build command: `npm run build`
- Start command: `npm start`
- Framework: Express.js u Other si el detector no reconoce el monorepo
- La aplicación escucha en el puerto 3000 por defecto, como requiere Hostinger.

El `start` de producción ejecuta de forma idempotente:

1. migraciones de MariaDB/MySQL;
2. creación/verificación del superadministrador configurado;
3. seeds de catálogo y blog;
4. inicio del servidor Express.

## 3. CORS y dominio

Si frontend y API salen desde la misma app, usa el dominio público en `CORS_ALLOWED_ORIGINS`, por ejemplo `https://tudominio.com`. En producción el frontend usa `/api` en el mismo origen cuando `VITE_PUBLIC_API_URL` no está configurado o queda vacío.

## 4. Almacenamiento de imágenes y PDF

`FILE_STORAGE_ROOT` debe apuntar a un directorio persistente y escribible en el runtime. Verifica la persistencia del directorio después de un redeploy; si Hostinger reemplaza el filesystem de build en cada despliegue, mueve estos archivos a almacenamiento persistente externo antes de producción intensiva.

## 5. Verificación posterior

Comprueba:

- `GET /health` devuelve `database: "connected"`;
- catálogo y categorías cargan;
- login del administrador funciona;
- creación/edición de productos e imágenes;
- blog y portadas;
- generación de cotización/PDF y envío por email;
- reinicio de la app sin duplicar datos del seed.
