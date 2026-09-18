# Asistente virtual de ISOCAL

## Objetivo

El asistente público de ISOCAL es un motor conversacional determinístico orientado al contenido real del sistema. No llama a un modelo generativo externo ni completa información por intuición: recupera, puntúa y relaciona únicamente datos que ya están publicados en el frontend o que llegan desde las APIs públicas del proyecto.

Su prioridad es **ser útil sin inventar capacidades, productos, precios, acreditaciones ni contenidos**.

## Fuentes de conocimiento

El motor combina dos grupos de fuentes:

- **Conocimiento estático versionado:** empresa, contacto, red de laboratorios, respaldo técnico, política, sectores, servicios, 19 áreas de calibración y sus equipos, mantenimiento, ensayos, consultoría, normas, capacitaciones, auditoría, herramientas, navegación, favoritos y flujo de cotización.
- **Conocimiento dinámico:** productos, categorías y artículos publicados, obtenidos mediante las APIs públicas existentes.

Cada fuente dinámica conserva su estado de disponibilidad. Si una API falla, el asistente diferencia `fuente no disponible` de `fuente disponible sin coincidencias`; por ello una caída temporal del backend nunca se convierte en una afirmación como “ISOCAL no vende ese producto”.

## Flujo de respuesta

1. Normaliza la consulta: tildes, variantes, símbolos, singular/plural y términos técnicos.
2. Clasifica la intención: producto, calibración, mantenimiento, consultoría, capacitación, auditoría, normas, cotización, contacto, herramientas, conversión, blog, navegación, etc.
3. Recupera documentos candidatos mediante scoring léxico y aliases controlados.
4. Valida evidencia de la entidad concreta solicitada. Las palabras genéricas como `calibración`, `servicio`, `industrial` o `ISOCAL` no son suficientes para declarar una capacidad.
5. Aplica guardrails específicos para cada intención.
6. Construye una respuesta con enlaces a la sección real del sistema y un nivel de confianza.
7. Conserva contexto corto para preguntas posteriores como “¿y cuánto cuesta ese?”.

## Guardrails principales

- Un producto solo se afirma como disponible cuando existe en el catálogo cargado.
- Una capacidad de calibración solo se afirma cuando coincide con un elemento publicado del portafolio metrológico.
- Consultoría, capacitación y auditoría no se confunden con certificaciones propias de ISOCAL.
- Para ISO/IEC 17025 se distingue entre la red de laboratorios acreditados publicada y una acreditación corporativa que el sitio no declara.
- Los precios no se inventan; el asistente deriva a cotización cuando el sitio no publica una tarifa fija.
- Consultas fuera de dominio se rechazan de forma explícita.
- Las conversiones reutilizan el conversor del sistema y sus validaciones físicas, incluido el cero absoluto.
- La recuperación difusa tolera errores de escritura sin relajar globalmente los umbrales de evidencia.

## Archivos

```text
frontend/src/features/assistant/
├── components/VirtualAssistant.tsx
├── data/
│   ├── assistantKnowledge.ts
│   └── loadAssistantKnowledge.ts
├── hooks/useVirtualAssistant.ts
├── model/
│   ├── assistant.types.ts
│   ├── assistantEngine.ts
│   ├── assistantEngine.test.ts
│   └── assistantText.ts
└── styles/assistant.css
```

La integración visual se realiza desde `frontend/src/features/public-site/components/FloatingTools.tsx`.

## Actualización del conocimiento

Para productos, categorías y artículos no se deben crear respuestas hardcodeadas: el loader consume las APIs existentes y genera documentos de recuperación automáticamente.

Para capacidades técnicas versionadas (por ejemplo, nuevos equipos de calibración o nuevas normas), se actualizan primero los archivos de datos del sitio. El asistente consume esas mismas estructuras, evitando mantener dos portafolios independientes.

## Pruebas

`assistantEngine.test.ts` cubre clasificación, recuperación, contexto conversacional, productos, servicios, normas, conversiones, errores tipográficos, entidades no publicadas, consultas fuera de alcance y fallos de fuentes dinámicas.

Durante la implementación se ejecutó además una matriz de estrés generada sobre el portafolio completo para probar cada capacidad y producto con múltiples formulaciones, errores ortográficos y consultas adversariales.
