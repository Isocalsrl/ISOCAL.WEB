# Desarrollo

## Inicio rápido

Desde la raíz:

```bash
npm install
cp .env.example .env
npm run dev
```

`npm run dev` valida el entorno, prepara MariaDB/MySQL, aplica migraciones, ejecuta seeds y levanta backend + frontend.

Si la base ya está preparada:

```bash
npm run dev:app
```

Para reconstruir únicamente MariaDB/MySQL de desarrollo:

```bash
npm run dev:fresh
```

El almacenamiento de imágenes/PDF no se elimina con ese comando.

## Verificación antes de un PR

```bash
npm run check
```

El pipeline ejecuta:

1. `check:architecture`;
2. typecheck de backend y frontend;
3. ESLint del frontend;
4. tests;
5. builds de producción.

También puedes ejecutar solo:

```bash
npm run check:architecture
```

La verificación arquitectónica no pretende reemplazar una revisión de código; evita regresiones sencillas como que `shared` empiece a depender de features o que un repository consuma internals de otro módulo.

## Flujo para agregar un endpoint backend

1. Define/actualiza tipos del módulo.
2. Añade validación de input si corresponde.
3. Implementa persistencia en el repository.
4. Implementa la regla/caso de uso en el service.
5. Expón una función pequeña desde el controller.
6. Registra la ruta y middlewares.
7. Añade tests donde la regla lo amerite.

No empieces por crear carpetas nuevas. Usa la estructura existente del módulo.

## Dependencias entre módulos backend

Si un módulo necesita comportamiento de otro, consume preferentemente su **service**.

Ejemplo válido:

```text
categories.service -> products.service
```

Evita importar `repository`, `mapper`, `validation` o `types` internos de otro módulo desde esas capas internas. Si un contrato realmente es transversal, muévelo a `shared` con un nombre específico.

## Flujo para agregar una pantalla/frontend feature

1. Revisa si la funcionalidad ya pertenece a una feature existente.
2. Crea/actualiza su `page`.
3. Extrae componentes cuando tengan una responsabilidad propia o reutilización real.
4. Mantén HTTP en `api`, efectos/estado en hooks y lógica pura en `model`.
5. Coloca estilos en la misma feature.
6. Registra la ruta en `app/router`.

`shared` es para piezas verdaderamente transversales, no para vaciar las features.

## CSS

Evita nombres como:

```text
new.css
fix.css
overrides.css
final.css
polish.css
```

Esos nombres describen el momento en que se creó el archivo, no su responsabilidad.

Usa nombres como:

```text
catalog-layout.css
product-detail.css
header.css
workspace.css
```

Antes de añadir una regla a `public-site/styles/components/site-integration.css`, comprueba si pertenece claramente a una feature o sección. La capa de integración debe ser la excepción.

## Variables de entorno

Existe una sola plantilla versionada:

```text
.env.example
```

El `.env` real vive en la raíz y está ignorado por Git. No copies secretos a documentación, fixtures, patches o ejemplos.

## Migraciones

Nunca edites ni renombres una migración que ya pudo ejecutarse en otra máquina. Para cualquier cambio crea una migración nueva con prefijo único. Consulta [DATABASE.md](DATABASE.md).

## Assets de seed

Portafolio:

```text
backend/src/database/seeds/assets/portfolio/
```

Blog:

```text
backend/src/database/seeds/assets/blog/
```

Los seeds no deben sobrescribir contenido administrado vigente.
