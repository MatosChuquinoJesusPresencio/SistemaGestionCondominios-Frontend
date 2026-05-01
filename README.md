# 🏢 Sistema de Gestión de Condominios - Frontend
## Rama: `pagina-principal` - Landing Page

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

Esta rama contiene la **página principal y landing page** del Sistema de Gestión de Condominios. Una plataforma web moderna diseñada para presentar de forma atractiva la solución de administración integral de condominios.

---

## 🎯 Características de la Página Principal

### Hero Section
- **Presentación Impactante:** Portada visual atractiva que introduce la solución.
- **Call-to-Action Claro:** Botones destacados para login y acceso rápido.
- **Diseño Responsive:** Adaptado perfectamente a dispositivos móviles y de escritorio.

### Secciones Principales

#### 1. **Presentación del Servicio**
- Explicación clara del propósito de la plataforma.
- Descripción de beneficios y ventajas competitivas.
- Imagen o video de demostración.

#### 2. **Características Destacadas**
- Cards interactivas mostrando funcionalidades clave.
- Animaciones suaves para mejorar la experiencia.
- Información sobre los tres niveles de acceso (Super Admin, Admin, Propietario).

#### 3. **Planes y Precios**
- Comparativa de planes disponibles.
- Tabla de precios transparente.
- Información de suscripción.

#### 4. **Contacto y Footer**
- Formulario de contacto funcional.
- Enlaces de redes sociales.
- Información de la empresa y políticas.

---

## 📋 Stack Tecnológico

**Frontend:**
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
- [Bootstrap 5](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.github.io/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animaciones avanzadas
- [React Router 7](https://reactrouter.com/) - Enrutamiento
- [React Hook Form](https://react-hook-form.com/) - Gestión de formularios
- [React Icons](https://react-icons.github.io/react-icons/) - Iconografía

**Librerías Especializadas (Página Principal):**
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) - Animaciones al hacer scroll
- [React Slick](https://react-slick.neostack.com/) & [Slick Carousel](https://kenwheeler.github.io/slick/) - Carrusel de imágenes/contenido
- [@popperjs/core](https://popper.js.org/) - Posicionamiento de elementos flotantes

---

## 🚀 Instalación y Desarrollo

### 1. **Clonar el repositorio:**

```bash
git clone https://github.com/MatosChuquinoJesusPresencio/SistemaGestionCondominios-Frontend.git
cd SistemaGestionCondominios-Frontend
git checkout pagina-principal
```

### 2. **Instalar dependencias:**

```bash
npm install
```

### 3. **Instalar dependencias específicas de la página principal:**

```bash
npm install aos react-slick slick-carousel
npm install bootstrap @popperjs/core
```

### 4. **Ejecutar en modo desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 📦 Dependencias Instaladas

### Dependencias Principales
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.14.1",
  "react-hook-form": "^7.72.1",
  "react-bootstrap": "^2.10.10",
  "bootstrap": "^5.3.8",
  "framer-motion": "^12.38.0",
  "react-icons": "^5.6.0"
}
```

### Dependencias de Página Principal
```json
{
  "aos": "^2.3.4",
  "react-slick": "^0.31.0",
  "slick-carousel": "^1.8.1",
  "@popperjs/core": "^2.11.x"
}
```

---

## 🎨 Estructura del Proyecto - Rama pagina-principal

```text
src/
├── PaginaPrincipal/           # Componentes de la landing page
│   ├── Hero.jsx              # Sección hero
│   ├── Navbar.jsx            # Navegación
│   ├── Services.jsx          # Sección de servicios
│   ├── FeatureCard.jsx       # Cards de características
│   ├── Pricing.jsx           # Tabla de precios
│   ├── Contact.jsx           # Formulario de contacto
│   ├── Footer.jsx            # Pie de página
│   ├── LandingPage.jsx       # Página principal completa
│   └── Styles/               # Estilos personalizados
│
├── components/               # Componentes compartidos
├── constants/                # Constantes y configuraciones
├── hooks/                    # Custom hooks
├── providers/                # Context providers
├── routers/                  # Configuración de rutas
└── styles/                   # Estilos globales
```

---

## Proyecto Académico

Este sistema ha sido desarrollado como un proyecto académico para la **Universidad Tecnológica del Perú (UTP)**, para el curso de Herramientas de Desarrollo.

---

## 📜 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`
Ejecuta la aplicación en modo desarrollo.
La página se recargará automáticamente cuando realices cambios.

### `npm run build`
Compila el proyecto para producción en la carpeta `dist`.

### `npm run lint`
Ejecuta ESLint para verificar la calidad del código.

### `npm run preview`
Previsualiza la compilación de producción localmente.

---

## 🔗 Enlaces Importantes

- **Repositorio:** [GitHub - SistemaGestionCondominios-Frontend](https://github.com/MatosChuquinoJesusPresencio/SistemaGestionCondominios-Frontend)
- **Rama:** `pagina-principal`
- **Deploy (Producción):** https://sistemagestioncondominios-frontend.onrender.com

---

## 👥 Contribución

Para contribuir a este proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y disponible bajo la licencia MIT.

---

## ✉️ Contacto

Para consultas o sugerencias sobre el proyecto, puedes contactarnos a través de la página principal de la aplicación.

---

**Última actualización:** Abril 2026
**Rama Activa:** `pagina-principal`

