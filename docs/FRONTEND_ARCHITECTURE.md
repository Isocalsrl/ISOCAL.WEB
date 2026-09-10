# Arquitectura del frontend

## Objetivo

Mantener separadas la composición de la aplicación, las funciones compartidas
y la lógica propia de cada feature pública o administrativa.

## Flujo principal

```text
AppRouter → guard de autenticación → AdminLayout → página del módulo
                                                ↓
                                   API → cliente HTTP → backend

AppRouter → PublicLayout → página pública
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

## Organización de estilos

La paleta, tipografía y anchos principales viven en
shared/styles/theme.css. El panel, el login, el sitio público y los
componentes UI consumen esas mismas variables; un cambio de identidad visual
se realiza allí y no se duplica por tipo de usuario.

El punto de entrada del sitio público es features/public-site/styles/index.css.
Sus archivos se separan por responsabilidad:

- layout.css: estructura, contenedores y hero de páginas internas.
- components.css: patrones usados por más de una página pública.
- header.css y footer.css: navegación y pie de página.
- home.css, about.css, services.css y catalog.css: reglas exclusivas de cada
  pantalla.
- responsive.css: ajustes agrupados por breakpoint.

Los botones y enlaces de acción públicos y administrativos usan los
componentes de shared/components/ui. Si una regla se reutiliza entre dos
pantallas, debe ir en components.css; si pertenece a una sola, debe quedarse
en el archivo de esa página.

## Organización de autenticación

La feature auth sigue el mismo criterio modular que productos:

- api/ contiene exclusivamente las llamadas HTTP.
- types/ define los contratos.
- context/ y hooks/ administran y exponen la sesión.
- guards/ protege las rutas según sesión y rol.
- validation/ contiene validaciones puras.
- components/ contiene el formulario y piezas reutilizables.
- pages/ compone las pantallas sin concentrar su lógica interna.

El acceso al login administrativo no forma parte de la navegación del sitio
público. Conocer su ruta no reemplaza los controles de sesión y rol aplicados
en frontend y backend.
