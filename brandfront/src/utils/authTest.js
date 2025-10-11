// Utilidad para probar autenticación y CSRF
import { authAPI } from '../api/auth';
import http from '../api/http';

export const testAuthentication = async () => {
  console.log('🔍 Probando autenticación...');
  
  try {
    // Verificar perfil
    const profile = await authAPI.getProfile();
    console.log('✅ Perfil obtenido:', {
      username: profile.username,
      email: profile.email,
      role: profile.role,
      id: profile.id
    });
    
    return {
      success: true,
      user: profile
    };
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testCSRFToken = async () => {
  console.log('🍪 Probando CSRF token...');
  
  try {
    // Verificar cookies
    const cookies = document.cookie;
    console.log('🍪 Cookies actuales:', cookies);
    
    const csrfToken = cookies.split(';').find(cookie => 
      cookie.trim().startsWith('csrftoken=')
    );
    
    if (csrfToken) {
      console.log('✅ CSRF token encontrado:', csrfToken);
      return {
        success: true,
        token: csrfToken.split('=')[1]
      };
    } else {
      console.log('❌ CSRF token no encontrado en cookies');
      return {
        success: false,
        error: 'CSRF token no encontrado'
      };
    }
  } catch (error) {
    console.error('❌ Error verificando CSRF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testSessionStatus = async () => {
  console.log('📡 Probando estado de sesión...');
  
  try {
    const sessionStatus = await authAPI.getSessionStatus();
    console.log('✅ Estado de sesión:', sessionStatus);
    
    return {
      success: true,
      session: sessionStatus
    };
  } catch (error) {
    console.error('❌ Error verificando sesión:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testAdminPermissions = async () => {
  console.log('👑 Probando permisos de admin...');
  
  try {
    // Verificar autenticación
    const authTest = await testAuthentication();
    if (!authTest.success) {
      throw new Error('Usuario no autenticado');
    }
    
    // Verificar rol de admin
    if (authTest.user.role !== 'admin') {
      throw new Error(`Usuario no es admin. Rol actual: ${authTest.user.role}`);
    }
    
    console.log('✅ Permisos de admin verificados');
    
    return {
      success: true,
      user: authTest.user
    };
  } catch (error) {
    console.error('❌ Error verificando permisos de admin:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testSimplePost = async () => {
  console.log('📤 Probando operación POST simple...');
  
  try {
    // Hacer una request POST simple para verificar CSRF
    const response = await http.post('/user/admin/users/', {
      // Body vacío, solo para probar CSRF
    });
    
    console.log('✅ POST exitoso:', response.status);
    return {
      success: true,
      response: response.data
    };
  } catch (error) {
    console.error('❌ Error en POST:', error.response?.status, error.response?.data);
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export const runAuthDiagnostics = async () => {
  console.log('🔧 Ejecutando diagnóstico completo de autenticación...');
  
  const results = {
    authentication: await testAuthentication(),
    csrf: await testCSRFToken(),
    session: await testSessionStatus(),
    adminPermissions: await testAdminPermissions(),
    simplePost: await testSimplePost()
  };
  
  console.log('📊 Resultados del diagnóstico:', results);
  
  const allSuccess = Object.values(results).every(result => result.success);
  
  if (allSuccess) {
    console.log('🎉 ¡Todos los tests de autenticación pasaron!');
  } else {
    console.log('⚠️ Algunos tests de autenticación fallaron');
  }
  
  return {
    allSuccess,
    results
  };
};
