# 🏢 Sistema de Gestión de Condominios - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

Una plataforma web moderna y robusta diseñada para la administración integral de condominios, facilitando la interacción entre administradores, propietarios y residentes.

---

## ✨ Características Principales

El sistema está dividido en tres niveles de acceso principales, cada uno con funcionalidades específicas:

### 👑 Super Administrador

- **Gestión Global:** Control total sobre múltiples condominios.
- **Administración de Usuarios:** Creación y gestión de cuentas administrativas.
- **Control de Departamentos:** Visualización y gestión de la estructura habitacional.
- **Historial General:** Seguimiento de todas las actividades críticas en la plataforma.

### 🏢 Administrador de Condominio

- **Dashboard Personalizado:** Estadísticas clave de su condominio.
- **Gestión de Infraestructura:** Administración de torres, pisos y unidades.
- **Control de Residentes:** Registro y gestión de propietarios y residentes.
- **Historial de Acceso:** Monitoreo de entradas y salidas (vehiculares y peatonales).

### 🏠 Propietario / Residente

- **Mi Apartamento:** Información detallada de su unidad habitacional.
- **Gestión de Vehículos:** Registro y control de sus vehículos autorizados.
- **Historial Personal:** Consulta de accesos y movimientos relacionados con su unidad.

---

## 🛠️ Stack Tecnológico

- **Frontend:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilos:** [Bootstrap 5](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.github.io/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Iconos:** [React Icons](https://react-icons.github.io/react-icons/)
- **Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Enrutamiento:** [React Router 7](https://reactrouter.com/)

---

## 🚀 Instalación y Desarrollo

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/MatosChuquinoJesusPresencio/SistemaGestionCondominios-Frontend.git
   cd SistemaGestionCondominios-Frontend
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

---

## 📁 Estructura del Proyecto

```text
src/
├── components/        # Componentes reutilizables (UI, Modales, Tablas)
├── constants/         # Menús y constantes globales
├── data/              # Mockups y datos estáticos
├── hooks/             # Custom hooks (Paginación, Auth, etc.)
├── layouts/           # Estructuras de página (PrivateLayout)
├── pages/             # Vistas principales divididas por rol
├── providers/         # Context Providers (AuthContext)
├── routers/           # Configuración de rutas y guardias de seguridad
└── utils/             # Formateadores y funciones de utilidad
```

---

## 🎓 Proyecto Académico

Este sistema ha sido desarrollado como un proyecto académico para la **Universidad Tecnológica del Perú (UTP)**, para el curso de Herramientas de Desarrollo.
