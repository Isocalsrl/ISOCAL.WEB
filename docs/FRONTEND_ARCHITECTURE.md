# Arquitectura del frontend

## Objetivo

Mantener separadas la composición de la aplicación, las funciones compartidas y
la lógica propia de cada módulo administrativo.

## Flujo principal

```text
AppRouter → guard de autenticación → AdminLayout → página del módulo
                                                ↓
                                   API → cliente HTTP → backend
```

- **`app/`:** compone providers y rutas.
- **`features/auth/`:** administra login, sesión y protección de rutas.
- **`features/admin/`:** contiene el layout y la presentación común del panel.
- **`features/products/`:** contiene contratos, llamadas y pantallas de productos.
- **`features/categories/`:** contiene contratos, llamadas y gestión de categorías.
- **`shared/api/`:** interpreta el contrato HTTP común del backend.
- **`shared/components/`:** contiene únicamente piezas visuales reutilizables.
- **`shared/utils/`:** contiene transformaciones puras usadas por varios módulos.

## Rutas administrativas

```text
/admin/products                  listado de productos
/admin/products/new              creación de producto
/admin/products/:productId/edit  edición de producto
/admin/categories                gestión de categorías
```

Todas las rutas se renderizan dentro de `ProtectedRoute`. Mientras se verifica
la cookie de sesión se muestra un estado de carga; una respuesta `401` redirige
al login y un error de conexión permite reintentar la consulta.

## Componentes compartidos

Los botones, campos, confirmaciones y estados de sección comparten el mismo
lenguaje visual, pero no contienen reglas de productos o categorías. Cada
feature conserva sus validaciones, estados y llamadas a la API.

## Contrato actual del catálogo

Los endpoints de listado devuelven únicamente registros activos. Por esa razón,
cuando un producto o una categoría se desactiva deja de aparecer en el panel.
La categoría no puede desactivarse mientras tenga productos asociados; el
mensaje enviado por la API se presenta directamente al administrador.
