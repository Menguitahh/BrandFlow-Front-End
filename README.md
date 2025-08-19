# BrandFlow Frontend

## Descripción del Proyecto

BrandFlow es una aplicación web desarrollada en React que permite gestionar y visualizar flujos de marca de manera intuitiva y eficiente.

## Estructura del Proyecto

```
BrandFlow-Front-End/
├── brandfront/          # Aplicación React principal
│   ├── public/          # Archivos estáticos
│   ├── src/             # Código fuente
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── styles/      # Estilos CSS
│   │   └── utils/       # Utilidades y helpers
│   └── package.json     # Dependencias del proyecto
├── docs/               # Documentación del proyecto
└── README.md           # Este archivo
```

## Diagrama de la Home

### Estructura de Componentes

```
App.js
├── Header
│   ├── Logo
│   ├── Navigation
│   └── UserMenu
├── Main Content
│   ├── Hero Section
│   │   ├── Title
│   │   ├── Subtitle
│   │   └── CTA Button
│   ├── Features Section
│   │   ├── Feature Card 1
│   │   ├── Feature Card 2
│   │   └── Feature Card 3
│   └── Dashboard Preview
│       ├── Chart Component
│       ├── Stats Cards
│       └── Recent Activity
└── Footer
    ├── Links
    ├── Social Media
    └── Copyright
```

### Flujo de Navegación

```
Home Page
├── Login/Register
├── Dashboard
│   ├── Analytics
│   ├── Brand Management
│   └── Reports
├── Profile
└── Settings
```

## Tecnologías Utilizadas

- **React 18** - Framework principal
- **Bootstrap 5** - Framework CSS para el diseño
- **React Router** - Navegación entre páginas
- **Chart.js** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP para APIs

## Instalación y Configuración

1. Clonar el repositorio:

```bash
git clone [url-del-repositorio]
cd BrandFlow-Front-End
```

2. Instalar dependencias:

```bash
cd brandfront
npm install
```

3. Ejecutar en modo desarrollo:

```bash
npm start
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm test` - Ejecuta las pruebas
- `npm run build` - Construye la aplicación para producción
- `npm run eject` - Expone la configuración de webpack (irreversible)

## Estructura de Componentes

### Componentes Principales

- `App.js` - Componente raíz de la aplicación
- `Header.js` - Barra de navegación superior
- `Home.js` - Página principal
- `Dashboard.js` - Panel de control
- `Footer.js` - Pie de página

### Componentes Reutilizables

- `Button.js` - Botones personalizados
- `Card.js` - Tarjetas de contenido
- `Modal.js` - Ventanas modales
- `Chart.js` - Componentes de gráficos

## Estado del Proyecto

- ✅ Sección 5: Documentación del diseño inicial completada
- ✅ Sección 6: Implementación de la aplicación completada
- ✅ Trabajo Práctico N°7: Sistema de autenticación implementado

## Sistema de Autenticación

### Características Implementadas:

- ✅ **Login/Logout**: Sistema completo de autenticación
- ✅ **Registro**: Formulario de registro de nuevos usuarios
- ✅ **Control de Acceso**: Rutas protegidas con ProtectedRoute
- ✅ **Persistencia**: Estado guardado en localStorage
- ✅ **Validaciones**: Formularios con validaciones hardcodeadas
- ✅ **UI/UX**: Interfaz moderna con Bootstrap y Bootstrap Icons

### Credenciales de Demo:

- **Admin**: admin@brandflow.com / admin123
- **Usuario**: user@brandflow.com / user123

### Funcionalidades:

- **AuthContext**: Gestión centralizada del estado de autenticación
- **ProtectedRoute**: Componente para proteger rutas
- **Login**: Formulario con validaciones y manejo de errores
- **Register**: Registro de nuevos usuarios con validaciones
- **Header Dinámico**: Muestra información del usuario y opciones de logout
- **Persistencia**: Mantiene la sesión activa entre recargas

## Próximos Pasos

1. ✅ Implementar la estructura de componentes según el diagrama
2. ✅ Integrar Bootstrap para el diseño responsive
3. ✅ Crear las páginas principales (Home, Dashboard, etc.)
4. ✅ Implementar la navegación con React Router
5. ✅ Añadir funcionalidades de autenticación
6. Integrar APIs para datos dinámicos
7. Implementar funcionalidades de gestión de marcas
8. Añadir gráficos interactivos con Chart.js

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
