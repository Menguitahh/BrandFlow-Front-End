# 🔑 **CREDENCIALES DE ADMINISTRADOR**

## **Para Probar el Panel de Administración:**

### **Credenciales:**

- **Usuario:** `admin`
- **Contraseña:** `Admin123!`
- **Email:** `admin@example.com`

### **Funcionalidades Disponibles:**

#### **1. Gestión de Usuarios (`/admin/users`)**

- ✅ Ver todos los usuarios del sistema
- ✅ Filtrar por rol (admin, diseñador, cliente, etc.)
- ✅ Buscar usuarios por nombre o email
- ✅ Cambiar roles de usuarios
- ✅ Estadísticas por tipo de usuario

#### **2. Asignación de Diseñadores (`/admin/assign`)**

- ✅ Ver todos los proyectos
- ✅ Ver diseñadores disponibles
- ✅ Asignar diseñadores a proyectos
- ✅ Estadísticas de proyectos por estado

#### **3. Gestión de Servicios (`/admin/services`)**

- ✅ Ver servicios existentes (11 servicios pre-cargados)
- ✅ Crear nuevos servicios
- ✅ Gestionar categorías de servicios

#### **4. Revisión de Cotizaciones (`/admin/quotes`)**

- ✅ Ver todas las cotizaciones
- ✅ Aprobar/rechazar cotizaciones
- ✅ Asignar diseñadores tras aprobación

### **Servicios Pre-cargados:**

- **Logo Básico** ($150) - 3-5 días
- **Logo Premium** ($350) - 7-10 días
- **Identidad Corporativa Completa** ($800) - 15-20 días
- **Landing Page** ($400) - 5-7 días
- **Sitio Web Corporativo** ($1200) - 10-15 días
- **Kit Redes Sociales** ($200) - 3-5 días
- **Campaña Publicitaria** ($500) - 7-10 días
- **Tarjetas de Presentación** ($80) - 2-3 días
- **Folleto Corporativo** ($300) - 5-7 días
- **Diseño de Etiqueta** ($250) - 4-6 días
- **Packaging Completo** ($600) - 10-14 días

### **Flujo de Trabajo:**

1. **Cliente** crea cotización → Status: `quote`
2. **Admin** revisa y aprueba cotización → Se crea proyecto
3. **Admin** asigna diseñador → Status: `in_progress`
4. **Diseñador** trabaja en el proyecto
5. **Cliente** paga → Status: `completed`

### **Endpoints del Backend:**

- `GET /api/user/admin/users/` - Lista usuarios
- `GET /api/user/admin/designers/` - Lista diseñadores
- `POST /api/user/admin/set-role/` - Cambiar rol
- `POST /api/branding/projects/{id}/assign_designer/` - Asignar diseñador
- `POST /api/branding/services/` - Crear servicio

**¡Todo está funcionando perfectamente!** 🎉
