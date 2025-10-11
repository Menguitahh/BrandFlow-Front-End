// Utilidad para probar el sistema de login
import { authAPI } from '../api/auth';

export const testLoginCredentials = async () => {
  console.log('🧪 Probando credenciales de login...');
  
  const testCredentials = [
    { identifier: 'admin', password: 'Admin123!', expectedRole: 'admin' },
    { identifier: 'admin@example.com', password: 'Admin123!', expectedRole: 'admin' },
    { identifier: 'diseñador', password: 'Designer123!', expectedRole: 'diseñador' },
    { identifier: 'designer@example.com', password: 'Designer123!', expectedRole: 'diseñador' },
    { identifier: 'cliente', password: 'Cliente123!', expectedRole: 'cliente' },
    { identifier: 'cliente@example.com', password: 'Cliente123!', expectedRole: 'cliente' }
  ];

  const results = [];

  for (const cred of testCredentials) {
    try {
      console.log(`🔐 Probando: ${cred.identifier}...`);
      
      const response = await authAPI.login(cred.identifier, cred.password);
      
      const success = response.user && response.user.role === cred.expectedRole;
      
      results.push({
        identifier: cred.identifier,
        expectedRole: cred.expectedRole,
        actualRole: response.user?.role,
        success,
        message: success ? '✅ Login exitoso' : '❌ Rol incorrecto'
      });
      
      console.log(`${success ? '✅' : '❌'} ${cred.identifier}: ${response.user?.role}`);
      
    } catch (error) {
      results.push({
        identifier: cred.identifier,
        expectedRole: cred.expectedRole,
        actualRole: null,
        success: false,
        message: `❌ Error: ${error.message}`
      });
      
      console.log(`❌ ${cred.identifier}: Error - ${error.message}`);
    }
  }

  const successfulLogins = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Resultados: ${successfulLogins}/${totalTests} logins exitosos`);
  
  if (successfulLogins === totalTests) {
    console.log('🎉 ¡Todas las credenciales funcionan correctamente!');
  } else {
    console.log('⚠️ Algunas credenciales fallaron. Revisa los resultados arriba.');
  }

  return {
    total: totalTests,
    successful: successfulLogins,
    results
  };
};

// Función para probar un login específico
export const testSingleLogin = async (identifier, password) => {
  try {
    console.log(`🔐 Probando login: ${identifier}`);
    const response = await authAPI.login(identifier, password);
    
    console.log('✅ Login exitoso:', {
      user: response.user?.username,
      email: response.user?.email,
      role: response.user?.role
    });
    
    return {
      success: true,
      user: response.user
    };
    
  } catch (error) {
    console.log('❌ Login fallido:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para mostrar las credenciales disponibles
export const showAvailableCredentials = () => {
  console.log('🔑 Credenciales disponibles para login:');
  console.log('');
  console.log('👑 ADMIN:');
  console.log('   Usuario: admin');
  console.log('   Email: admin@example.com');
  console.log('   Contraseña: Admin123!');
  console.log('');
  console.log('🎨 DISEÑADOR:');
  console.log('   Usuario: diseñador');
  console.log('   Email: designer@example.com');
  console.log('   Contraseña: Designer123!');
  console.log('');
  console.log('👤 CLIENTE:');
  console.log('   Usuario: cliente');
  console.log('   Email: cliente@example.com');
  console.log('   Contraseña: Cliente123!');
  console.log('');
  console.log('💡 Puedes usar tanto el username como el email para iniciar sesión');
};
