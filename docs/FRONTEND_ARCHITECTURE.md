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
/admin/access-history            registro de accesos (solo super_admin)
```

Todas las rutas se renderizan dentro de `ProtectedRoute`. Mientras se verifica
la cookie de sesión se muestra un estado de carga; una respuesta `401` redirige
al login y un error de conexión permite reintentar la consulta.

`SuperAdminRoute` agrega el límite de navegación para las vistas reservadas al
propietario. Es una medida de presentación; el backend vuelve a validar el rol
en cada operación sensible.

## Componentes compartidos

Los botones, campos, confirmaciones y estados de sección comparten el mismo
lenguaje visual, pero no contienen reglas de productos o categorías. Cada
feature conserva sus validaciones, estados y llamadas a la API.

## Contrato actual del catálogo

Los listados privados respetan el rol de la sesión. Un `admin` recibe únicamente
registros activos; un `super_admin` recibe activos e inactivos y puede
reactivarlos. Los endpoints públicos continúan mostrando solo el contenido
activo. La categoría no puede desactivarse mientras tenga productos asociados;
el mensaje enviado por la API se presenta directamente al administrador.
