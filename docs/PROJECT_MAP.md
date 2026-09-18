# Mapa práctico del proyecto

Este documento responde a la pregunta: **“quiero cambiar X, ¿dónde empiezo?”**

## Backend

| Quiero cambiar… | Empieza en… | Después revisa… |
|---|---|---|
| login, logout o sesión admin | `backend/src/modules/auth/` | `auth.routes.ts` → `auth.controller.ts` → `auth.service.ts` |
| permisos admin/super_admin | `modules/auth/auth.authorization.ts` | service del módulo que aplica la regla de negocio |
| productos públicos/admin | `backend/src/modules/products/` | routes → controller → service → repository |
| carga de imagen de producto | `modules/products/productImageUpload.middleware.ts` | `productImage.service.ts`, storage compartido |
| categorías | `backend/src/modules/categories/` | service; consulta Products solo mediante `products.service` |
| blog | `backend/src/modules/blog/` | `blogImageUpload.middleware.ts` para uploads |
| solicitud pública | `backend/src/modules/requests/` | validator → controller → service |
| PDF/correo de cotización | `backend/src/modules/quotes/` | `documents/commercialQuotePdf.ts`, `quotes.service.ts` |
| proveedor de email | `backend/src/shared/email/` | `providers/resendEmail.provider.ts` |
| almacenamiento persistente | `backend/src/shared/storage/` | proveedor local y `storageService.ts` |
| respuesta/error HTTP global | `backend/src/middlewares/error.middleware.ts` | `shared/errors/AppError.ts` |
| nueva tabla/cambio de esquema | `backend/src/database/migrations/` | `docs/DATABASE.md` |
| contenido inicial | `backend/src/database/seeds/` | assets de seed correspondientes |

## Frontend

| Quiero cambiar… | Empieza en… |
|---|---|
| rutas públicas/admin | `frontend/src/app/router/` |
| home/nosotros/servicios/contacto | `frontend/src/features/public-site/` |
| catálogo o detalle público | `frontend/src/features/products/` |
| CRUD admin de productos | `frontend/src/features/products/` |
| categorías admin | `frontend/src/features/categories/` |
| blog público/admin | `frontend/src/features/blog/` |
| favoritos | `frontend/src/features/favorites/` |
| lista/formulario de cotización | `frontend/src/features/quotation/` |
| consultas/reclamos | `frontend/src/features/requests/` |
| buscador técnico | `frontend/src/features/search/` |
| asistente virtual | `frontend/src/features/assistant/` |
| herramientas técnicas | `frontend/src/features/technical-tools/` |
| sesión del panel | `frontend/src/features/auth/` |
| layout/dashboard admin | `frontend/src/features/admin/` |
| gestión de usuarios admin | `frontend/src/features/admin-users/` |
| botones, campos o feedback reutilizable | `frontend/src/shared/components/` |
| cliente HTTP | `frontend/src/shared/api/` |
| variables visuales globales | `frontend/src/shared/styles/theme.css` |

## Cómo seguir una funcionalidad

### Backend

Busca la ruta y sigue el flujo:

```text
*.routes.ts
  -> *.controller.ts
  -> *.service.ts
  -> *.repository.ts
```

Si existe una operación con archivos, PDF o integración externa, el service coordinará además esa pieza.

### Frontend

Empieza por la ruta o página y sigue:

```text
app/router
  -> feature/pages
  -> feature/components
  -> feature/hooks
  -> feature/api o feature/model
```

Para estilos, busca primero el selector dentro de `styles/` de la misma feature antes de tocar la capa de integración pública.

## Antes de crear un archivo nuevo

No crees automáticamente `service`, `hook`, `util`, `context` o `repository`. Créalo cuando tenga una responsabilidad reconocible.

Una buena señal para extraer un archivo es que puedes completar esta frase sin usar palabras vagas:

> “Este archivo es responsable de ______ y no de ______.”

Si no puedes hacerlo, probablemente la separación todavía no está justificada.
