# LOCALAID Frontend

Frontend para la plataforma LOCALAID construido con Next.js y Tailwind CSS.

## 🚀 Características

- **Framework**: Next.js con Pages Router
- **Estilos**: Tailwind CSS con diseño moderno y responsivo
- **HTTP Client**: Axios configurado para conectar con el backend
- **Autenticación**: Sistema de login/registro con localStorage
- **Páginas**:
  - Inicio (`/`) - Landing page con gradiente moderno
  - Registro (`/register`) - Formulario completo de registro
  - Login (`/login`) - Autenticación de usuarios
  - Perfil (`/profile`) - Gestión de perfil de usuario

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Instalar dependencias de desarrollo:
```bash
npm install -D tailwindcss postcss autoprefixer
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3001`

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo en puerto 3001
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter de ESLint

## 🔧 Configuración

### Backend API
El frontend está configurado para conectarse con el backend en:
```
http://localhost:3000/api
```

### Variables de Entorno
Crear archivo `.env.local` si necesitas variables de entorno:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📁 Estructura del Proyecto

```
localaid-frontend/
├── pages/
│   ├── _app.js          # Configuración global de la app
│   ├── index.js         # Página de inicio
│   ├── register.js      # Página de registro
│   ├── login.js         # Página de login
│   └── profile.js       # Página de perfil
├── styles/
│   └── globals.css      # Estilos globales con Tailwind
├── lib/
│   └── axios.js         # Configuración de Axios
├── tailwind.config.js   # Configuración de Tailwind
├── postcss.config.js    # Configuración de PostCSS
└── package.json         # Dependencias y scripts
```

## 🎨 Diseño

- **Colores**: Paleta moderna con azules y verdes
- **Tipografía**: Inter font para mejor legibilidad
- **Componentes**: Cards, botones y formularios estilizados
- **Responsive**: Diseño adaptativo para móviles y desktop
- **Gradientes**: Fondo con gradiente moderno en la página principal

## 🔐 Autenticación

- Login con email y contraseña
- Registro con todos los campos del modelo User
- Token JWT almacenado en localStorage
- Redirección automática según estado de autenticación
- Interceptores de Axios para manejo automático de tokens

## 📱 Páginas

### Inicio (`/`)
- Landing page con hero section
- Botones de navegación a registro/login
- Sección de características
- Navbar con estado de autenticación

### Registro (`/register`)
- Formulario completo con todos los campos del modelo User
- Validación de campos requeridos
- Geolocalización opcional
- Redirección automática al login tras registro exitoso

### Login (`/login`)
- Formulario de autenticación
- Manejo de errores
- Almacenamiento de token y datos de usuario
- Redirección al perfil tras login exitoso

### Perfil (`/profile`)
- Visualización de información de la cuenta
- Formulario editable para datos personales
- Actualización de perfil con API
- Validación de sesión (redirección si no está autenticado)

## 🚀 Despliegue

Para desplegar en producción:

1. Construir la aplicación:
```bash
npm run build
```

2. Ejecutar en producción:
```bash
npm run start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

