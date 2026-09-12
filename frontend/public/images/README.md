# Assets visuales del sitio público de ISOCAL

Este documento define los recursos gráficos esperados
por el frontend.

Las rutas se consumen directamente desde:

`frontend/public/images`

Por lo tanto, los nombres y ubicaciones deben mantenerse
exactamente como aparecen en este documento.

---

# Reglas generales

- Priorizar fotografías reales de ISOCAL cuando existan.
- No generar rostros de supuestos colaboradores de ISOCAL.
- No reemplazar al equipo real con personas ficticias.
- No generar logos de ISOCAL, INACAL, A2LA, PJLA,
  laboratorios asociados o marcas comerciales.
- Los logos deben provenir de archivos oficiales.
- Evitar texto incrustado dentro de fotografías.
- El texto debe renderizarse desde HTML para conservar
  accesibilidad y SEO.
- Evitar estética futurista.
- Evitar hologramas.
- Evitar luces neón.
- Evitar glassmorphism.
- Evitar laboratorios irreales.
- Evitar equipos físicamente imposibles.
- Evitar imágenes con apariencia evidente de IA.
- Buscar una estética corporativa y editorial.
- Priorizar luz natural.
- Priorizar instrumental real.
- Priorizar espacios técnicos creíbles.
- Usar colores neutros.
- Formato preferido para fotografías: `webp`.
- Formato preferido para logos: `svg`.
- Todos los logos deben tener fondo transparente.
- Comprimir las fotografías para web sin degradación
  visual evidente.

---

# 1. Marca

## `/images/brand/isocal-logo.svg`

Uso:

Header público sobre fondo claro.

Contenido:

Logotipo horizontal oficial de ISOCAL.

Fondo:

Transparente.

Color:

Versión oficial negro + rojo.

Medida sugerida:

Vector.

Si se parte de una imagen raster, usar como mínimo
700 px de ancho.

IMPORTANTE:

No reinterpretar ni regenerar el logo.

---

## `/images/brand/isocal-logo-white.svg`

Uso:

Footer sobre fondo azul marino u oscuro.

Contenido:

Versión horizontal oficial del logotipo adecuada
para fondo oscuro.

Fondo:

Transparente.

Color:

Blanco + rojo si existe una versión corporativa oficial.

IMPORTANTE:

Si no existe versión oficial para fondo oscuro,
adaptar únicamente los colores del archivo vectorial
oficial.

No redibujar el logo mediante IA.

---

## `/images/brand/isocal-social.png`

Uso:

Open Graph y vista previa cuando se comparte
el sitio en redes sociales o mensajería.

Medida recomendada:

1200 × 630 px.

Contenido:

Composición institucional simple con el logotipo
ISOCAL y el lema:

`Mediciones que mejoran decisiones`

Fondo:

Limpio y corporativo.

No utilizar fotografías de personas generadas.

---

# 2. Home — issue #18

## `/images/home/hero-equipo-isocal.webp`

Uso:

Hero principal de `/`.

Medida sugerida:

1920 × 1200 px o superior.

Relación aproximada:

16:10.

PRIORIDAD:

Usar la fotografía REAL del equipo de ISOCAL
que ya existe en el proyecto o en el sitio actual.

Preparar una versión horizontal de alta calidad.

No reemplazar a los trabajadores por personas
generadas.

Composición:

El equipo debe conservarse reconocible.

Dejar suficiente espacio visual en el sector
izquierdo e inferior para colocar texto encima.

No alterar rostros.

No agregar personas.

No cambiar uniformes ni logos.

---

## `/images/home/red-metrologica.webp`

Uso:

Sección `Red metrológica` del Home.

Medida sugerida:

1200 × 1000 px.

Relación aproximada:

6:5.

Contenido ideal:

Laboratorio real.

Técnico trabajando con instrumentación.

Equipo de calibración.

Detalle de instrumentos de medición.

Prioridad:

Fotografía real de ISOCAL o de uno de sus
laboratorios autorizada para el sitio web.

Si existe una fotografía vertical real,
realizar primero un recorte editorial antes de
generar una imagen ficticia.

---

## `/images/home/equipos-insumos.webp`

Uso:

Bloque del Home que dirige al catálogo
de productos.

Medida sugerida:

1200 × 900 px.

Relación:

4:3.

Contenido:

Composición limpia de instrumentos y equipos
de medición reales comercializados por ISOCAL.

No incluir:

- precios;
- botones falsos;
- textos publicitarios;
- interfaces;
- nombres inventados.

Se pueden utilizar fotografías oficiales de producto
o una composición fotográfica de varios equipos
sobre un fondo técnico neutro.

---

## `/images/services/metrologia.webp`

Uso inicial:

Tarjeta de Metrología del Home.

Posteriormente puede reutilizarse en `/servicios`.

Medida sugerida:

1200 × 900 px.

Contenido:

Calibración.

Instrumentos de medición.

Técnico trabajando con equipos reales.

Laboratorio.

Evitar:

Multímetros flotando.

Pantallas inventadas.

Instrumentos con escalas imposibles.

Equipos deformados.

---

## `/images/services/consultoria.webp`

Uso inicial:

Tarjeta de Consultoría del Home.

Medida sugerida:

1200 × 900 px.

Contenido:

Revisión profesional de documentación.

Normas.

Resultados.

Procesos.

Entorno corporativo técnico.

Debe sentirse:

B2B.

Serio.

Profesional.

Evitar una reunión genérica de stock con poses
exageradas.

---

## `/images/services/auditoria.webp`

Uso inicial:

Tarjeta de Auditoría del Home.

Medida sugerida:

1200 × 900 px.

Contenido:

Auditor revisando documentación.

Revisión de evidencias técnicas.

Inspección de un entorno industrial.

Inspección de laboratorio.

Mantener estética profesional y realista.

---

# 3. Nosotros — issue #19

## `/images/about/hero-nosotros.webp`

Uso:

Fotografía principal o hero de `/nosotros`.

Medida sugerida:

1920 × 1100 px.

PRIORIDAD:

Reutilizar una fotografía REAL del equipo ISOCAL.

Debe utilizar un recorte diferente al utilizado
en el Home para evitar que las dos páginas se
sientan idénticas.

No generar personas ficticias.

No reemplazar rostros.

---

## `/images/about/laboratorio-red.webp`

Uso:

Sección de red de laboratorios de `/nosotros`.

Medida sugerida:

1400 × 1000 px.

Contenido:

Ambiente de laboratorio acreditado.

Instrumentación.

Proceso de calibración.

Preferir material real autorizado.

---

## `/images/partners/gesmin.svg`

## `/images/partners/alab.svg`

## `/images/partners/fesepsa.svg`

## `/images/partners/ams-test.svg`

Uso:

Sección de alianza y red de laboratorios.

IMPORTANTE:

Utilizar únicamente logos oficiales
proporcionados por ISOCAL o obtenidos de una
fuente oficial autorizada.

No crear estos logos mediante IA.

No aproximarlos.

No redibujarlos manualmente.

---

# 4. Servicios — issue #20

## `/images/services/hero-servicios.webp`

Uso:

Hero de `/servicios`.

Medida sugerida:

1920 × 1100 px.

Contenido:

Técnico operando equipo de calibración.

Laboratorio.

Instrumentación industrial.

Composición:

Debe existir espacio libre suficiente para el
texto de la interfaz.

---

## `/images/services/metrologia-detalle.webp`

Uso:

Apertura del bloque de Metrología.

Medida sugerida:

1400 × 1050 px.

Contenido:

Instrumento siendo calibrado.

Procedimiento técnico.

Trabajo de metrología real.

---

## `/images/services/mantenimiento.webp`

Uso:

Sección de mantenimiento de equipos.

Medida sugerida:

1200 × 900 px.

Contenido:

Diagnóstico.

Mantenimiento preventivo.

Mantenimiento correctivo.

Equipo de laboratorio.

Equipo de monitoreo.

Instrumentación.

---

## `/images/services/ensayos.webp`

Uso:

Sección de Ensayos.

Medida sugerida:

1200 × 900 px.

Contenido posible:

Cabina de seguridad biológica.

Campana de flujo laminar.

Sala limpia.

Medición ambiental.

Mapeo de temperatura.

Mapeo de humedad.

Debe ser coherente con los servicios reales
del portafolio ISOCAL.

---

## `/images/services/consultoria-detalle.webp`

Uso:

Bloque amplio de Consultoría.

Medida sugerida:

1400 × 1000 px.

Contenido:

Consultoría sobre documentación ISO.

Capacitación.

Revisión de procesos.

Trabajo profesional B2B.

---

## `/images/services/auditoria-detalle.webp`

Uso:

Bloque amplio de Auditoría.

Medida sugerida:

1400 × 1000 px.

Contenido:

Auditoría técnica.

Auditoría de sistema de gestión.

Revisión de documentación.

Revisión de evidencias.

Entorno profesional realista.

---

# 5. Productos — issue #21

## `/images/products/hero-productos.webp`

Uso:

Hero de `/productos`.

Medida sugerida:

1920 × 1000 px.

Contenido:

Instrumentos de medición.

Equipos de laboratorio.

Equipos de monitoreo.

Equipos de seguridad.

IMPORTANTE:

No mostrar marcas o modelos que ISOCAL no
comercialice.

Usar preferentemente imágenes oficiales de los
fabricantes con los que trabaja ISOCAL.

---

## `/images/products/catalogo-editorial.webp`

Uso:

Bloque editorial previo o posterior al catálogo
dinámico.

Medida sugerida:

1400 × 1000 px.

Contenido:

Conjunto de equipos reales en una composición
sobria.

IMPORTANTE:

Esta fotografía es EDITORIAL.

No debe asociarse visualmente con un producto
individual del catálogo si el backend no entrega
un campo `imageUrl`.

El catálogo dinámico debe seguir mostrando
únicamente la información que realmente entregue
la API.

---

# 6. Favoritos y cotización

## `/images/favorites/hero-favoritos.webp`

Uso:

Hero de `/favoritos` con una selección ordenada de
instrumentos de medición y espacio visual para el texto.

## `/images/quotation/hero-cotizacion.webp`

Uso:

Hero de `/cotizacion` con instrumentos, documentación
técnica y una revisión comercial sutil.

Ambas fotografías evitan texto, marcas, precios e
interfaces incrustadas.

---

# Checklist para Codex / responsable de assets

1. Crear todas las carpetas faltantes respetando
   exactamente las rutas de este README.

2. Revisar primero todos los recursos reales que
   ya existen en el repositorio.

3. Optimizar y reutilizar fotografías reales antes
   de generar alternativas.

4. No sobrescribir una fotografía real con una
   versión generada.

5. Mantener exactamente los nombres de archivo
   documentados aquí.

6. Exportar fotografías preferentemente en WebP.

7. Mantener logos preferentemente en SVG.

8. Comprimir fotografías para intentar mantenerlas
   aproximadamente por debajo de 500–700 KB cuando
   sea razonable.

9. No sacrificar calidad visible solamente para
   conseguir un peso determinado.

10. Comprobar el frontend en desktop y móvil.

11. Verificar que ningún rostro importante quede
    cortado.

12. Verificar que ningún instrumento quede deformado
    por `object-fit`.

13. Verificar que no existan textos incrustados
    innecesariamente dentro de las imágenes.

14. Si falta una fotografía real crítica, documentar
    primero la ausencia antes de fabricar una
    sustitución artificial.

15. Los logos de empresas, laboratorios,
    acreditadoras o fabricantes jamás deben
    generarse mediante IA.
