# Arquitectura del frontend

## Objetivo

Mantener cada archivo enfocado en una responsabilidad concreta para que una
modificación de interfaz, estado, acceso a datos o estilos pueda hacerse sin
tener que recorrer una página monolítica.

La separación se hace por responsabilidad, no por alcanzar un número arbitrario
de líneas. Un archivo de datos estáticos puede ser más largo que un componente
con lógica; lo importante es evitar mezclar responsabilidades que evolucionan
por motivos diferentes.

## Flujo principal

```text
AppRouter → guard de autenticación → AdminLayout → page
                                                ↓
                                      hook de caso de uso
                                       ↓           ↓
                                    API         model

AppRouter → PublicLayout → page → sections/components
                              ↓
                         hook de vista/datos
```

- **`app/`:** compone providers y rutas.
- **`pages/`:** representa una ruta y orquesta piezas; no concentra bloques
  grandes de JSX ni lógica de negocio/interacción.
- **`components/`:** renderiza bloques visuales con una responsabilidad clara.
- **`hooks/`:** concentra estado, efectos y casos de uso de la interfaz.
- **`model/`:** contiene estado de formularios, validaciones y transformaciones
  puras propias de una feature.
- **`api/`:** contiene exclusivamente las llamadas HTTP de la feature.
- **`types/`:** define contratos de datos.
- **`shared/`:** contiene piezas realmente reutilizadas por varias features.

## Regla para las páginas

Una página debe poder leerse como el índice de la pantalla. Debe indicar qué
secciones aparecen y qué hook coordina la vista, pero no contener cientos de
líneas de markup o de manejo de estado.

Ejemplo del sitio público:

```text
ServicesPage
├── ServicesHeroSection
├── ServicesIntroSection
├── MetrologySection
├── ConsultingSection
├── AuditSection
└── ServicesProductsCtaSection
```

Esto no añade capas por estética: permite modificar una sección sin tocar las
demás y mantiene en la página únicamente la composición de la ruta y su SEO.

## Regla para hooks de gestión

Cuando una pantalla administrativa necesita carga, edición y mutaciones, esas
responsabilidades se separan cuando pueden cambiar de manera independiente.

```text
CategoriesPage
└── useCategoriesManagement        coordinación del caso de uso
    ├── useCategoriesCollection    carga y colección de categorías
    └── useCategoryEditor          estado y edición del formulario

ProductsPage
└── useProductsManagement          acciones administrativas
    └── useProductsCollection      carga, nombres de categorías y colección

ProductFormPage
└── useProductForm                 carga/guardado/navegación
    └── useProductEditor           estado editable y generación de slug
```

Los componentes reciben datos y callbacks. No realizan llamadas HTTP si esa
operación pertenece al caso de uso de la pantalla.

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

## Sitio público

La feature `public-site` separa la composición general de las secciones de cada
página:

```text
features/public-site/
├── components/
│   ├── about/
│   ├── home/
│   └── services/
│       └── sections/
├── data/
│   └── services/
├── pages/
└── styles/
```

Los datos extensos de servicios se agrupan por dominio (`metrology`,
`consulting`, `audit`) y se reexportan desde `data/services/index.ts`. Así, los
componentes no dependen de la ubicación interna de cada conjunto de datos.

## Catálogo público

El catálogo diferencia tres responsabilidades:

- `usePublicCatalog`: obtiene productos y categorías.
- `useCatalogView`: interpreta filtros, búsqueda y parámetros de URL.
- `components/public/catalog/`: presenta hero, toolbar, resultados y sección.

La ruta de detalle anterior se mantiene por compatibilidad, pero su carga vive
en `usePublicProductDetail` y su presentación en `PublicProductDetail`.

## Componentes compartidos

Los botones, campos, confirmaciones y estados de sección comparten el mismo
lenguaje visual, pero no contienen reglas de productos o categorías. Cada
feature conserva sus validaciones, estados y llamadas a la API.

No se crean duplicados vacíos para "reservar" nombres de componentes. Un
módulo se agrega cuando tiene una responsabilidad real.

## Organización de estilos

La paleta, tipografía y anchos principales viven en `shared/styles/theme.css`.
El panel, el login, el sitio público y los componentes UI consumen esas mismas
variables.

El punto de entrada del sitio público es
`features/public-site/styles/index.css`. Los estilos grandes se dividen por
sección manteniendo el orden de imports para conservar exactamente la cascada.

```text
styles/
├── about/
├── catalog/
├── components/
├── header/
├── home/
├── services/
└── index.css
```

Cada carpeta tiene un `index.css` cuando necesita agrupar varias hojas. El
orden de esos imports forma parte del comportamiento visual y no debe cambiarse
sin revisar la cascada.

Los estilos UI compartidos conservan `shared/components/ui/ui.css` como punto
de entrada y delegan sus reglas a `styles/buttons.css`, `forms.css`,
`feedback.css`, `status.css` y `responsive.css`.

## Organización de autenticación

La feature `auth` sigue el mismo criterio modular:

- `api/` contiene exclusivamente las llamadas HTTP.
- `types/` define los contratos.
- `context/` y `hooks/` administran y exponen la sesión.
- `guards/` protege las rutas según sesión y rol.
- `validation/` contiene validaciones puras.
- `components/` contiene el formulario y piezas reutilizables.
- `pages/` compone las pantallas sin concentrar su lógica interna.

El acceso al login administrativo no forma parte de la navegación del sitio
público. Conocer su ruta no reemplaza los controles de sesión y rol aplicados
en frontend y backend.

## Criterios para cambios nuevos

1. Una `page` compone; no se convierte en el lugar donde vive toda la feature.
2. Un componente visual no llama a la API salvo que esa sea explícitamente su
   responsabilidad.
3. Estado y efectos reutilizables o complejos viven en hooks de la feature.
4. Validaciones y transformaciones puras viven fuera del JSX.
5. `shared/` solo recibe código compartido por más de una feature; no se usa
   como carpeta genérica para evitar decidir dónde pertenece algo.
6. Antes de crear un archivo nuevo, debe poder describirse su responsabilidad
   en una frase.
7. No se divide un archivo de datos estáticos únicamente por cantidad de líneas
   si sigue representando un único conjunto coherente.

## Estado persistido entre features

Favoritos y cotización representan dominios diferentes, pero ambos persisten
una colección de IDs de productos en `localStorage`. La mecánica reutilizable
vive en `shared/storage/persistedProductIds.ts` y
`shared/hooks/usePersistedProductIds.ts`; cada feature conserva su propio
provider y vocabulario (`favoriteProductIds`, `quotationProductIds`, etc.).

La regla es compartir el mecanismo, no fusionar dominios. Una nueva colección
persistida debe reutilizar esa infraestructura solo si tiene las mismas
semánticas de almacenamiento y sincronización entre pestañas.

## Propiedad de estilos entre features

Una feature no debe modificar desde su hoja de estilos la estructura interna de
otra. Favoritos y cotización definen la apariencia de sus propios controles;
Productos define en `features/products/styles/public-actions.css` cómo esos
controles se acomodan dentro de tarjetas, modales y vistas de detalle de
productos.

Esto evita dependencias invisibles donde editar `favorites/styles` pueda romper
la composición de un modal perteneciente a Productos.

## Comportamiento compartido de diálogos

El comportamiento técnico de un diálogo accesible (Escape, focus trap,
restauración del foco y bloqueo del scroll) vive en
`shared/hooks/useAccessibleDialog.ts`. Los componentes siguen siendo dueños de
su contenido y markup; el hook comparte únicamente el comportamiento que se
repite entre `ProductDetailModal`, `ConfirmDialog` y futuros diálogos.
