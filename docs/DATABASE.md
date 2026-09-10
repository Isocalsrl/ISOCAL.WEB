# ISOCAL — Modelo de Datos

## Objetivo

Definir la información principal que manejará el sistema y servir como referencia para desarrollo y diseño.

Actualmente el sistema contempla tres entidades principales:

* Categorías
* Productos
* Administradores

---

## Categorías

Las categorías permiten organizar los productos del catálogo.

Información actual:

* Nombre
* Slug / URL
* Descripción
* Estado activo o inactivo

Una categoría puede contener varios productos.

---

## Productos

Representan los productos que aparecerán en el catálogo de ISOCAL.

Información actual:

* Nombre
* Slug / URL
* Descripción
* Categoría
* Estado activo o inactivo

Cada producto puede pertenecer a una categoría.

---

## Administradores

Son los usuarios que tendrán acceso al panel administrativo.

Información actual:

* Nombre
* Correo
* Contraseña protegida
* Rol
* Estado de la cuenta
* Último inicio de sesión

Roles iniciales:

* `admin`
* `super_admin`

Los visitantes normales de la web no necesitan una cuenta.

## Sesiones de administradores

Cada inicio de sesión crea una fila temporal asociada al administrador. La base
de datos conserva únicamente el hash del token, junto con su fecha de
expiración. Al cerrar sesión se elimina la fila correspondiente; las sesiones
expiradas también se limpian durante nuevos inicios de sesión.

---

## Relación principal

```text
CATEGORÍA
   │
   └── PRODUCTOS
```

Una categoría puede tener varios productos.

---

### Tarjeta de producto

Por ejemplo:

* Imagen
* Nombre
* Categoría
* Descripción corta
* Botón de detalle
* Botón de cotización


---

## Estado actual

El modelo base de:

* Categorías
* Productos
* Administradores

ya está definido.
