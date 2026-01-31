# 🧮 Calculator Frontend Angular

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21.1.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material](https://img.shields.io/badge/Angular_Material-21.1-757575?style=for-the-badge&logo=material-design&logoColor=white)

**Calculadora web moderna con diseño estilo iOS, construida con las últimas tecnologías de Angular**

[Demo](#demo) • [Características](#-características) • [Instalación](#-instalación) • [Despliegue](#-comandos-de-despliegue)

</div>

---

## 📸 Vista Previa

Una calculadora elegante con interfaz estilo iOS que incluye:
- Diseño responsivo con botones circulares
- Panel lateral de historial de operaciones
- Indicadores de carga en tiempo real
- Validación visual de límites numéricos

---

## ✨ Características

### 🏗️ Arquitectura Moderna
- **Angular 21.1** - Última versión del framework con las mejores prácticas
- **Componentes Standalone** - Sin NgModules, arquitectura más limpia y moderna
- **Signals** - Sistema de reactividad moderno de Angular para manejo de estado
- **OnPush Change Detection** - Optimización de rendimiento con detección de cambios eficiente

### 🎨 Interfaz de Usuario
- **Angular Material 21** - Componentes UI de alta calidad con tema personalizado
- **Tailwind CSS 4** - Utilidades CSS modernas para estilos rápidos y consistentes
- **Diseño estilo iOS** - Botones circulares y colores característicos (naranja/gris)
- **Responsive Design** - Adaptable a cualquier tamaño de pantalla
- **Animaciones fluidas** - Transiciones suaves en hover y click

### ♿ Accesibilidad (WCAG AA)
- Etiquetas ARIA completas en todos los elementos interactivos
- Soporte para lectores de pantalla con `aria-live` y `aria-label`
- Contraste de colores que cumple estándares WCAG AA
- Navegación por teclado optimizada
- Gestión de foco adecuada

### 🔧 Funcionalidades
| Función | Descripción |
|---------|-------------|
| **Operaciones Básicas** | Suma, resta, multiplicación y división |
| **Historial** | Panel lateral con todas las operaciones realizadas |
| **Validación** | Límite de números: -999.99 a 999.99 con alertas visuales |
| **Cambio de Signo** | Toggle positivo/negativo (+/−) |
| **Backspace** | Borrado de dígitos individual |
| **Decimales** | Soporte para números decimales |
| **API Backend** | Comunicación con servicio REST para cálculos |

### 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Angular | 21.1.0 | Framework principal |
| TypeScript | 5.9.2 | Lenguaje de programación |
| Angular Material | 21.1.2 | Componentes UI |
| Tailwind CSS | 4.1.12 | Estilos utilitarios |
| RxJS | 7.8.0 | Programación reactiva |
| Vitest | 4.0.8 | Testing unitario |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── calculator/
│   │   ├── calculator.ts          # Componente principal
│   │   ├── calculator.html        # Template con Material + Tailwind
│   │   ├── calculator.service.ts  # Servicio de API
│   │   └── calculator.models.ts   # Interfaces TypeScript
│   ├── app.config.ts              # Configuración de la aplicación
│   ├── app.html                   # Template raíz
│   └── app.ts                     # Componente raíz
├── environments/
│   ├── environment.ts             # Configuración desarrollo
│   └── environment.prod.ts        # Configuración producción
├── styles.css                     # Estilos globales + Tailwind
└── material-theme.scss            # Tema personalizado Material
```

---

## 🚀 Instalación

### Prerrequisitos
- **Node.js** 20.x o superior
- **npm** 10.x o superior
- **Angular CLI** 21.x

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/calculator-frontend-ng.git

# 2. Entrar al directorio
cd calculator-frontend-ng

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

---

## 🖥️ Comandos de Desarrollo

```bash
# Servidor de desarrollo con hot reload
npm start
# o
ng serve

# Servidor en puerto específico
ng serve --port 4300

# Servidor abierto automáticamente en navegador
ng serve --open

# Servidor con configuración de producción
ng serve --configuration production
```

---

## 🏭 Comandos de Despliegue

### Build de Producción

```bash
# Build optimizado para producción
npm run build
# o
ng build --configuration production

# Build con análisis de bundle
ng build --configuration production --stats-json

# Build con source maps (para debugging)
ng build --configuration production --source-map
```

### Salida del Build

Los archivos compilados se generan en `dist/calculator-frontend-ng/browser/`:

```
dist/calculator-frontend-ng/browser/
├── index.html
├── main-[hash].js
├── polyfills-[hash].js
├── styles-[hash].css
└── assets/
```

### Despliegue en cPanel

#### 📦 Paso 1: Generar Build de Producción

```bash
# Build optimizado para producción
ng build --configuration production
```

Los archivos compilados estarán en `dist/calculator-frontend-ng/browser/`.

#### 🌐 Paso 2: Subir Archivos a cPanel

1. **Acceder a cPanel** - Ingresa al panel de control de tu hosting
2. **Abrir Administrador de Archivos** - Navega a `Administrador de archivos`
3. **Ir a public_html** - Entra en la carpeta `public_html` (o el subdirectorio donde quieras desplegar)
4. **Subir archivos** - Sube **todo el contenido** de la carpeta `dist/calculator-frontend-ng/browser/`:
   - `index.html`
   - Archivos `.js` (main, polyfills)
   - Archivos `.css`
   - Carpeta `assets/` (si existe)

> **💡 Tip:** Puedes comprimir los archivos en un `.zip`, subirlo y extraerlo directamente en cPanel para mayor velocidad.

#### ⚙️ Paso 3: Configurar .htaccess

Crea un archivo `.htaccess` en la misma carpeta donde subiste los archivos (`public_html` o subdirectorio) con el siguiente contenido:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

> **⚠️ Importante:** Si desplegaste en un subdirectorio (ej: `public_html/calculadora/`), ajusta el `RewriteBase`:
> ```apache
> RewriteBase /calculadora/
> ```

#### 🔧 Paso 4: Configurar Base Href (Opcional)

Si la aplicación estará en un subdirectorio, debes compilar con el base href correcto:

```bash
# Para subdirectorio /calculadora/
ng build --configuration production --base-href /calculadora/
```

#### ✅ Verificación

1. Abre tu dominio en el navegador: `https://tu-dominio.com/`
2. Verifica que la calculadora carga correctamente
3. Prueba navegar y refrescar la página (el `.htaccess` debe manejar las rutas)

#### 🔍 Solución de Problemas Comunes

| Problema | Solución |
|----------|----------|
| Página en blanco | Verifica que todos los archivos JS/CSS se subieron correctamente |
| Error 404 al refrescar | Revisa que el `.htaccess` esté configurado correctamente |
| Rutas no funcionan | Verifica el `RewriteBase` en `.htaccess` |
| Recursos no cargan | Revisa que el `--base-href` coincida con tu subdirectorio |

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios con Vitest
npm test
# o
ng test

# Tests con cobertura
ng test --coverage

# Tests en modo watch
ng test --watch
```

---

## ⚙️ Configuración de Entornos

### Desarrollo (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Producción (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com/api'
};
```

### Cambiar URL del API

Edita los archivos en `src/environments/` para configurar la URL de tu backend.

---

## 📊 Métricas de Rendimiento

| Métrica | Valor |
|---------|-------|
| Bundle inicial | < 500KB (warning) / < 1MB (error) |
| Estilos por componente | < 4KB (warning) / < 8KB (error) |
| First Contentful Paint | Optimizado |
| Change Detection | OnPush para máximo rendimiento |

---

## 🔐 Buenas Prácticas Implementadas

- ✅ **Strict Type Checking** - TypeScript estricto
- ✅ **Componentes Standalone** - Sin NgModules
- ✅ **Signals para Estado** - Reactividad moderna
- ✅ **OnPush Change Detection** - Rendimiento optimizado
- ✅ **inject()** - Inyección de dependencias moderna
- ✅ **Control Flow Nativo** - @if, @for, @switch
- ✅ **Accesibilidad WCAG AA** - Cumplimiento de estándares

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ usando Angular 21**

</div>
