# 🔧 **SOLUCIÓN AL ERROR 403 (FORBIDDEN)**

## 📋 **PROBLEMA IDENTIFICADO**

Se está produciendo un error `403 Forbidden` en las operaciones POST, específicamente en `/user/admin/set-role/`.

---

## 🔍 **CAUSAS POSIBLES**

### **1. ❌ Problema de CSRF Token**

- El token CSRF no se está enviando correctamente
- El token CSRF no se ha inicializado después del login
- El backend no está configurado para aceptar CSRF

### **2. ❌ Problema de Autenticación**

- La sesión no está establecida correctamente
- El usuario no tiene permisos de admin
- El token de autorización no se está enviando

### **3. ❌ Problema de Backend**

- El endpoint no existe o está mal configurado
- Los permisos no están configurados correctamente
- CORS no está configurado para credenciales

---

## 🛠️ **SOLUCIONES IMPLEMENTADAS**

### **✅ 1. Diagnóstico de Autenticación**

- **Nuevo botón "Diagnóstico"** en el dashboard de admin
- **Verificación completa** de autenticación, CSRF, sesión y permisos
- **Logs detallados** en consola para identificar el problema

### **✅ 2. Inicialización de CSRF**

- **CSRF se inicializa** después del login exitoso
- **Verificación automática** del token CSRF en cookies
- **Endpoint de perfil** usado para inicializar CSRF

### **✅ 3. Verificación de Permisos**

- **Verificación de rol admin** antes de operaciones POST
- **Validación de autenticación** antes de cada operación
- **Mensajes de error** específicos para cada problema

---

## 🧪 **HERRAMIENTAS DE DIAGNÓSTICO**

### **Botones en Dashboard de Admin:**

1. **"Probar GET"** - Verifica endpoints de lectura
2. **"Probar POST"** - Verifica operaciones de escritura
3. **"Probar Login"** - Verifica credenciales
4. **"Diagnóstico"** - Verifica autenticación completa

### **Funciones de Diagnóstico:**

```javascript
// Verificar autenticación
testAuthentication();

// Verificar CSRF token
testCSRFToken();

// Verificar sesión
testSessionStatus();

// Verificar permisos de admin
testAdminPermissions();

// Verificar POST simple
testSimplePost();

// Diagnóstico completo
runAuthDiagnostics();
```

---

## 🎯 **PASOS PARA SOLUCIONAR**

### **1. 🔍 Ejecutar Diagnóstico**

1. **Iniciar sesión** como admin (`admin` / `Admin123!`)
2. **Ir al dashboard** (`/admin`)
3. **Hacer clic en "Diagnóstico"**
4. **Revisar resultados** en consola y alertas

### **2. 📊 Analizar Resultados**

- **✅ Autenticación:** Usuario autenticado correctamente
- **✅ CSRF Token:** Token presente en cookies
- **✅ Sesión:** Sesión activa y válida
- **✅ Permisos Admin:** Usuario tiene rol admin

### **3. 🛠️ Aplicar Soluciones**

#### **Si CSRF falla:**

```javascript
// El token CSRF se inicializa automáticamente después del login
// Si falla, verificar que el backend esté configurado para CSRF
```

#### **Si autenticación falla:**

```javascript
// Verificar que el usuario esté logueado correctamente
// Verificar que el rol sea 'admin'
```

#### **Si permisos fallan:**

```javascript
// Verificar que el usuario tenga rol 'admin'
// Verificar que el endpoint exista en el backend
```

---

## 🔧 **CONFIGURACIÓN ACTUAL**

### **✅ Axios Configurado:**

```javascript
// Base URL
baseURL: 'http://localhost:8000/api'

// Credenciales
withCredentials: true

// Headers
'Content-Type': 'application/json'
'X-CSRFToken': csrfToken (automático)

// Interceptors
- Request: Agrega Authorization y CSRF
- Response: Maneja errores 401 y 403
```

### **✅ CSRF Token:**

```javascript
// Se obtiene de cookies
const csrfToken = document.cookie
  .split(";")
  .find((cookie) => cookie.trim().startsWith("csrftoken="))
  ?.split("=")[1];

// Se agrega automáticamente a POST/PUT/DELETE
headers["X-CSRFToken"] = csrfToken;
```

### **✅ Autenticación:**

```javascript
// Verificación de perfil
const profile = await authAPI.getProfile();

// Verificación de rol
if (profile.role !== "admin") {
  throw new Error("Usuario no es admin");
}
```

---

## 📱 **INTERFAZ DE DIAGNÓSTICO**

### **Dashboard de Admin:**

- **4 botones de prueba** para verificar diferentes aspectos
- **Alertas visuales** con resultados de cada prueba
- **Logs detallados** en consola para debugging

### **Resultados de Diagnóstico:**

- **Autenticación:** ✅/❌ Usuario autenticado
- **CSRF Token:** ✅/❌ Token presente
- **Sesión:** ✅/❌ Sesión activa
- **Permisos Admin:** ✅/❌ Rol correcto

---

## 🎉 **ESTADO ACTUAL**

### **✅ Implementado:**

- **Diagnóstico completo** de autenticación
- **Inicialización automática** de CSRF
- **Verificación de permisos** antes de operaciones
- **Herramientas de debugging** en dashboard

### **🔧 Para Probar:**

1. **Iniciar sesión** como admin
2. **Ejecutar diagnóstico** completo
3. **Revisar logs** en consola
4. **Aplicar soluciones** según resultados

---

## 🚨 **SI EL PROBLEMA PERSISTE**

### **Verificar Backend:**

1. **Endpoint existe:** `/user/admin/set-role/`
2. **Permisos configurados:** Solo admins pueden acceder
3. **CSRF habilitado:** Django CSRF middleware activo
4. **CORS configurado:** `withCredentials: true` permitido

### **Verificar Frontend:**

1. **Usuario autenticado:** Sesión activa
2. **Rol correcto:** Usuario es admin
3. **CSRF token:** Presente en cookies
4. **Headers correctos:** Authorization y X-CSRFToken

### **Logs a Revisar:**

```javascript
// En consola del navegador
✅ CSRF token inicializado después del login
👤 Usuario autenticado: admin Rol: admin
🍪 CSRF token encontrado: [token]
✅ Permisos de admin verificados
```

**¡Con estas herramientas puedes identificar y solucionar el problema 403!** 🔧
