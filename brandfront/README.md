# BrandFlow Frontend

Sistema de gestión de proyectos de branding desarrollado con React, Bootstrap y autenticación por roles. Plataforma enfocada en servicios de branding sin funcionalidades de e-commerce.

## 🚀 Características

- **Autenticación por roles**: Admin, Diseñador, Cliente
- **Gestión de servicios**: Catálogo de servicios de branding
- **Sistema de cotizaciones**: Crear, revisar, aprobar/rechazar
- **Gestión de proyectos**: Seguimiento completo del ciclo de vida
- **Chat en tiempo real**: Comunicación entre cliente, diseñador y admin
- **Sistema de pagos**: Simulación de pagos para proyectos
- **Dashboard administrativo**: Estadísticas y gestión completa
- **Páginas públicas**: Servicios y cotizaciones sin autenticación
- **Diseño moderno**: Gradientes, animaciones y glassmorphism
- **Responsive design**: Compatible con dispositivos móviles

## 🛠️ Tecnologías

- **React 19.1.1** - Framework principal
- **React Router DOM 7.7.1** - Enrutamiento
- **Bootstrap 5.3.7** - Framework CSS
- **Bootstrap Icons 1.13.1** - Iconografía
- **Axios 1.11.0** - Cliente HTTP
- **Context API** - Gestión de estado

## 📋 Prerrequisitos

- Node.js 16+
- npm o yarn
- Backend de BrandFlow ejecutándose en puerto 8000

## 🚀 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd brandfront
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp env.example .env
   ```

   Editar `.env` según tu configuración:

   ```env
   REACT_APP_API_BASE=http://localhost:8000/api
   REACT_APP_JWT_STORAGE=localStorage
   REACT_APP_MOCK_AUTH=true
   ```

4. **Ejecutar en desarrollo**

   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 👥 Usuarios de Prueba

### Modo Mock (por defecto)

- **Admin**: `admin@brandflow.com` / `admin123`
- **Diseñador**: `disenador@brandflow.com` / `disenador123`
- **Cliente**: `cliente@brandflow.com` / `cliente123`

### Modo API Real

Cambiar `REACT_APP_MOCK_AUTH=false` en `.env` para usar la API real.

## 🎯 Funcionalidades por Rol

### 👑 Administrador

- Dashboard con estadísticas generales
- Gestión de servicios y categorías
- Revisión y aprobación de cotizaciones
- Gestión de proyectos y asignación de diseñadores
- Administración de usuarios y roles

### 🎨 Diseñador

- Dashboard con proyectos asignados
- Lista de proyectos en progreso
- Chat directo con clientes
- Gestión de entregas y actualizaciones

### 👤 Cliente

- Dashboard personal
- Creación de cotizaciones
- Seguimiento de proyectos
- Chat con diseñadores
- Sistema de pagos

## 📱 Rutas Principales

### Públicas (Sin autenticación)

- `/` - Página principal con servicios destacados
- `/services` - Catálogo completo de servicios
- `/quote` - Formulario de cotización
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### Cliente

- `/client` - Dashboard cliente
- `/client/quotes` - Mis cotizaciones
- `/client/projects` - Mis proyectos
- `/client/projects/:id` - Detalle del proyecto

### Diseñador

- `/designer` - Dashboard diseñador
- `/designer/projects` - Proyectos asignados
- `/designer/projects/:id` - Detalle del proyecto

### Admin

- `/admin` - Dashboard admin
- `/admin/services` - Gestión de servicios y categorías
- `/admin/quotes` - Revisión de cotizaciones
- `/admin/projects` - Gestión de proyectos
- `/admin/users` - Gestión de usuarios

## 🔧 Configuración

### Variables de Entorno

| Variable                | Descripción              | Valor por defecto           |
| ----------------------- | ------------------------ | --------------------------- |
| `REACT_APP_API_BASE`    | URL base de la API       | `http://localhost:8000/api` |
| `REACT_APP_JWT_STORAGE` | Almacenamiento del token | `localStorage`              |
| `REACT_APP_MOCK_AUTH`   | Usar autenticación mock  | `true`                      |

### Modos de Autenticación

1. **Modo Mock**: Autenticación simulada con usuarios hardcodeados
2. **Modo Real**: Conexión con API backend real

Cambiar entre modos desde el menú de usuario en la aplicación.

## 🎨 Personalización

### Tema Monocromo

El tema utiliza una paleta de colores en blanco, negro y grises:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111111;
  --accent: #000000;
  --border-light: #e5e5e5;
}
```

### Componentes Bootstrap

- Sistema de grid responsivo
- Componentes de formulario
- Alertas y modales
- Tablas y cards
- Sistema de badges

## 📡 API Integration

### Endpoints Principales

#### Autenticación

- `POST /user/login/` - Inicio de sesión
- `POST /user/register/` - Registro
- `GET /user/profile/` - Perfil del usuario
- `POST /user/logout/` - Cerrar sesión

#### Servicios

- `GET /branding/services/` - Listar servicios
- `POST /branding/services/` - Crear servicio (admin)
- `PUT /branding/services/{id}/` - Actualizar servicio (admin)
- `DELETE /branding/services/{id}/` - Eliminar servicio (admin)

#### Categorías

- `GET /branding/categories/` - Listar categorías
- `POST /branding/categories/` - Crear categoría (admin)
- `PUT /branding/categories/{id}/` - Actualizar categoría (admin)
- `DELETE /branding/categories/{id}/` - Eliminar categoría (admin)

#### Cotizaciones

- `GET /branding/quotes/` - Listar cotizaciones
- `POST /branding/quotes/` - Crear cotización
- `POST /branding/quotes/{id}/approve/` - Aprobar (admin)
- `POST /branding/quotes/{id}/reject/` - Rechazar (admin)

#### Proyectos

- `GET /branding/projects/` - Listar proyectos
- `POST /branding/projects/` - Crear proyecto
- `POST /branding/projects/{id}/assign_designer/` - Asignar diseñador (admin)
- `PUT /branding/projects/{id}/` - Actualizar proyecto

#### Mensajes

- `GET /branding/projects/messages/` - Listar mensajes
- `POST /branding/projects/messages/` - Enviar mensaje
- `POST /branding/projects/messages/upload/` - Subir archivos

#### Pagos

- `POST /branding/payments/simulate/` - Simular pago
- `GET /branding/payments/` - Listar pagos

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start

# Construcción para producción
npm run build

# Ejecutar tests
npm test

# Análisis de paquetes
npm run eject
```

## 📦 Estructura del Proyecto

```
src/
├── api/                 # Servicios de API
│   ├── http.js         # Configuración de Axios
│   ├── auth.js         # Servicios de autenticación
│   ├── admin.js        # Servicios administrativos
│   └── branding.js     # Servicios de branding
├── components/         # Componentes reutilizables
│   ├── Header.js       # Navegación principal
│   ├── ProtectedRoute.js # Rutas protegidas
│   └── RoleGuard.js    # Protección por roles
├── context/           # Context API
│   └── AuthContext.js # Contexto de autenticación
├── pages/             # Páginas de la aplicación
│   ├── admin/         # Páginas del admin
│   ├── client/        # Páginas del cliente
│   ├── designer/      # Páginas del diseñador
│   ├── PublicHome.js  # Página principal pública
│   ├── Services.js    # Catálogo de servicios
│   ├── Quote.js       # Formulario de cotización
│   ├── Login.js       # Inicio de sesión
│   └── Register.js    # Registro
├── styles/            # Estilos personalizados
│   ├── theme.css      # Tema monocromo
│   └── public.css     # Estilos para páginas públicas
├── App.css            # Estilos principales con gradientes
└── App.js             # Componente principal
```

## 🔒 Seguridad

- Rutas protegidas por autenticación
- Protección por roles de usuario
- Interceptores de Axios para manejo de tokens
- Limpieza automática de tokens expirados
- Validación de formularios

## 🎯 Funcionalidades Actuales

- ✅ Autenticación por roles (Admin, Diseñador, Cliente)
- ✅ Gestión de servicios y categorías
- ✅ Sistema de cotizaciones completo
- ✅ Gestión de proyectos con estados
- ✅ Chat en tiempo real con archivos
- ✅ Sistema de pagos simulado
- ✅ Páginas públicas sin autenticación
- ✅ Dashboard administrativo completo
- ✅ Diseño moderno con gradientes y animaciones

## 🚀 Próximas Funcionalidades

- [ ] Notificaciones en tiempo real
- [ ] Sistema de reportes avanzados
- [ ] Integración con pasarelas de pago reales
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Sistema de plantillas de proyectos

## 🐛 Resolución de Problemas

### Error de CORS

Asegúrate de que el backend esté configurado para aceptar requests desde `http://localhost:3000`.

### Error de Autenticación

Verifica que las credenciales sean correctas y que el backend esté ejecutándose.

### Problemas de Estilo

Limpia la caché del navegador y reinicia el servidor de desarrollo.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.
