# 🔑 **CREDENCIALES DE LOGIN**

## 📋 **RESUMEN**

El sistema de login ahora acepta tanto **username** como **email** para iniciar sesión.

---

## 🔐 **CREDENCIALES DISPONIBLES**

### **✅ Admin**

```
Usuario: admin
Contraseña: Admin123!
Email: admin@example.com
```

### **✅ Diseñador**

```
Usuario: diseñador
Contraseña: Designer123!
Email: designer@example.com
```

### **✅ Cliente**

```
Usuario: cliente
Contraseña: Cliente123!
Email: cliente@example.com
```

---

## 🌐 **CÓMO FUNCIONA**

### **Campo de Login:**

- **Etiqueta:** "Usuario o Email"
- **Tipo:** Texto libre
- **Placeholder:** "usuario o tu@email.com"
- **Descripción:** "Puedes usar tu nombre de usuario o tu dirección de email"

### **Ejemplos de Uso:**

```
✅ admin              ← Username
✅ admin@example.com  ← Email
✅ diseñador          ← Username
✅ designer@example.com ← Email
✅ cliente            ← Username
✅ cliente@example.com ← Email
```

---

## 🚀 **FUNCIONALIDADES**

### **✅ Login Flexible:**

- Acepta **username** (ej: `admin`)
- Acepta **email** (ej: `admin@example.com`)
- **Validación automática** en el backend
- **Mensajes de error** claros

### **✅ Redirección Automática:**

- **Admin** → `/admin` (Dashboard de administración)
- **Diseñador** → `/designer` (Dashboard de diseñador)
- **Cliente** → `/client` (Dashboard de cliente)

### **✅ Sesiones Persistentes:**

- **Cookies automáticas** para mantener sesión
- **Persistencia** al refrescar página
- **Logout** limpia sesión completamente

---

## 🧪 **PRUEBAS**

### **Probar Login con Username:**

1. Ir a `/login`
2. Ingresar: `admin`
3. Ingresar contraseña: `Admin123!`
4. Hacer clic en "Iniciar Sesión"
5. Debería redirigir a `/admin`

### **Probar Login con Email:**

1. Ir a `/login`
2. Ingresar: `admin@example.com`
3. Ingresar contraseña: `Admin123!`
4. Hacer clic en "Iniciar Sesión"
5. Debería redirigir a `/admin`

### **Probar con Otros Roles:**

- **Diseñador:** `diseñador` / `Designer123!` → `/designer`
- **Cliente:** `cliente` / `Cliente123!` → `/client`

---

## ⚠️ **NOTAS IMPORTANTES**

### **Backend:**

- ✅ **Endpoint:** `POST /api/user/login/`
- ✅ **Parámetro:** `identifier` (username o email)
- ✅ **Parámetro:** `password`
- ✅ **Respuesta:** Usuario completo con rol

### **Frontend:**

- ✅ **Campo:** `identifier` (acepta texto libre)
- ✅ **Validación:** Requerido
- ✅ **Placeholder:** Claro y descriptivo
- ✅ **Ayuda:** Texto explicativo debajo del campo

### **Seguridad:**

- ✅ **CSRF** configurado
- ✅ **withCredentials: true**
- ✅ **Sesiones** seguras
- ✅ **Logout** limpia todo

---

## 🎯 **EJEMPLOS DE USO**

### **Para Administradores:**

```
admin / Admin123!
admin@example.com / Admin123!
```

### **Para Diseñadores:**

```
diseñador / Designer123!
designer@example.com / Designer123!
```

### **Para Clientes:**

```
cliente / Cliente123!
cliente@example.com / Cliente123!
```

---

## 🎉 **LISTO PARA USAR**

### **Características:**

- ✅ **Login flexible** con username o email
- ✅ **Credenciales claras** en la interfaz
- ✅ **Redirección automática** por rol
- ✅ **Sesiones persistentes** con cookies
- ✅ **Interfaz intuitiva** y clara

### **Para Probar:**

1. **Ir a** `/login`
2. **Usar cualquier credencial** de arriba
3. **Ingresar** username O email
4. **Ingresar** contraseña
5. **Hacer clic** en "Iniciar Sesión"
6. **Ser redirigido** al dashboard correspondiente

**¡El login funciona perfectamente con username y email!** 🚀
