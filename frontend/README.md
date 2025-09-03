# Sistema de Gestión Escolar - React

## Descripción
Sistema de gestión escolar desarrollado con React que permite la administración de estudiantes y profesores, con un sistema de autenticación moderno y profesional.

## Características Principales

### 🔐 Sistema de Autenticación Mejorado
- **Login Profesional**: Interfaz moderna con diseño responsivo y animaciones suaves
- **Registro de Usuarios**: Formulario intuitivo con selección de roles (Estudiante/Profesor)
- **Validación de Formularios**: Validación en tiempo real con mensajes de error claros
- **Estados de Carga**: Indicadores visuales durante las operaciones de autenticación

### 🎨 Diseño y UX
- **Diseño Moderno**: Interfaz limpia y profesional con gradientes y sombras
- **Responsive Design**: Adaptable a dispositivos móviles y de escritorio
- **Animaciones**: Transiciones suaves y efectos de hover para mejor interactividad
- **Paleta de Colores**: Esquema de colores profesional y accesible

### 🚀 Funcionalidades
- **Gestión de Estudiantes**: CRUD completo para estudiantes
- **Gestión de Profesores**: CRUD completo para profesores
- **Dashboard**: Panel principal con navegación intuitiva
- **Perfil de Usuario**: Gestión de información personal

## Tecnologías Utilizadas

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **Estilos**: CSS3 con animaciones y responsive design
- **Estado**: React Hooks (useState, useEffect)
- **Navegación**: Programática con useNavigate

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Login.jsx       # Componente de login mejorado
│   ├── Register.jsx    # Componente de registro mejorado
│   ├── Dashboard.jsx   # Panel principal
│   ├── Profile.jsx     # Perfil de usuario
│   └── ...            # Otros componentes
├── styles/             # Archivos CSS
│   ├── Login.css       # Estilos del login
│   ├── Register.css    # Estilos del registro
│   └── ...            # Otros estilos
├── config.js           # Configuración de la API
├── App.js              # Componente principal con rutas
└── index.js            # Punto de entrada
```

## Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación
1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd mi-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre tu navegador en `http://localhost:3000`

## Características del Login Mejorado

### ✨ Diseño Visual
- **Gradiente de Fondo**: Fondo con gradiente azul-púrpura moderno
- **Tarjeta de Login**: Diseño tipo card con efecto glassmorphism
- **Tipografía**: Fuentes modernas y legibles
- **Iconos y Emojis**: Elementos visuales atractivos

### 🔧 Funcionalidades
- **Validación en Tiempo Real**: Verificación de campos mientras el usuario escribe
- **Estados de Carga**: Indicadores visuales durante el proceso de login
- **Manejo de Errores**: Mensajes de error claros y específicos
- **Navegación Inteligente**: Redirección automática después del login exitoso

### 📱 Responsive Design
- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Touch Friendly**: Elementos táctiles optimizados para móviles

## Características del Registro Mejorado

### 🎯 Selección de Roles
- **Estudiante**: Acceso a cursos, tareas y recursos educativos
- **Profesor**: Gestión de cursos, calificaciones y contenido educativo
- **Selector Visual**: Interfaz intuitiva para elegir el tipo de usuario

### ✅ Validación Avanzada
- **Nombre y Apellido**: Mínimo 2 caracteres
- **Email**: Formato válido de correo electrónico
- **Contraseña**: Mínimo 6 caracteres
- **Confirmación**: Verificación de que las contraseñas coincidan

### 🎨 Interfaz de Usuario
- **Layout en Grid**: Organización clara de campos relacionados
- **Feedback Visual**: Indicadores de estado para cada campo
- **Mensajes de Error**: Explicaciones claras de los errores
- **Estados de Carga**: Indicadores durante el proceso de registro

## Estilos y CSS

### 🎨 Sistema de Colores
- **Primario**: `#667eea` (Azul)
- **Secundario**: `#764ba2` (Púrpura)
- **Texto**: `#2d3748` (Gris oscuro)
- **Fondo**: `#f7fafc` (Gris claro)

### 🌟 Efectos Visuales
- **Sombras**: Sistema de sombras consistente
- **Gradientes**: Transiciones de color suaves
- **Animaciones**: Efectos de entrada y hover
- **Transiciones**: Cambios suaves entre estados

### 📱 Responsive Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## API y Backend

### 🔌 Endpoints
- **Autenticación**: `/auth/login/`, `/auth/register/`
- **Estudiantes**: `/estudiantes/*`
- **Profesores**: `/profesores/*`

### 🔐 Autenticación
- **OAuth2**: Implementación con tokens de acceso
- **Headers**: Autorización Bearer token
- **Almacenamiento**: LocalStorage para persistencia

## Mejoras Futuras

### 🚀 Próximas Funcionalidades
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Autenticación de dos factores
- [ ] Integración con redes sociales
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)

### 🎨 Mejoras de UI/UX
- [ ] Temas personalizables
- [ ] Más animaciones y micro-interacciones
- [ ] Componentes de notificación
- [ ] Modales y overlays mejorados

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando React y las mejores prácticas de desarrollo web moderno.**



