// Utilidad para verificar usuarios existentes en el backend
import { adminAPI } from '../api/admin';

export const verifyExistingUsers = async () => {
  console.log('👥 Verificando usuarios existentes en el backend...');
  
  try {
    // Obtener todos los usuarios
    const usersResponse = await adminAPI.users.list();
    const users = usersResponse.users || usersResponse;
    
    console.log(`📊 Total de usuarios encontrados: ${users.length}`);
    
    // Agrupar por rol
    const usersByRole = users.reduce((acc, user) => {
      const role = user.role || 'sin_rol';
      if (!acc[role]) acc[role] = [];
      acc[role].push({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });
      return acc;
    }, {});
    
    console.log('📋 Usuarios por rol:');
    Object.entries(usersByRole).forEach(([role, userList]) => {
      console.log(`  ${role.toUpperCase()}: ${userList.length} usuarios`);
      userList.forEach(user => {
        console.log(`    - ${user.username} (${user.email}) [ID: ${user.id}]`);
      });
    });
    
    // Buscar usuarios específicos que esperamos
    const expectedUsers = ['admin', 'diseñador', 'designer', 'cliente'];
    const foundUsers = [];
    
    expectedUsers.forEach(expectedUsername => {
      const found = users.find(user => 
        user.username === expectedUsername || 
        user.username === expectedUsername.toLowerCase() ||
        user.username === expectedUsername.toUpperCase()
      );
      
      if (found) {
        foundUsers.push({
          expected: expectedUsername,
          actual: found.username,
          email: found.email,
          role: found.role
        });
        console.log(`✅ ${expectedUsername} encontrado como: ${found.username} (${found.email}) - Rol: ${found.role}`);
      } else {
        console.log(`❌ ${expectedUsername} NO encontrado`);
      }
    });
    
    return {
      success: true,
      totalUsers: users.length,
      usersByRole,
      foundUsers,
      allUsers: users
    };
    
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getWorkingCredentials = async () => {
  console.log('🔑 Obteniendo credenciales que funcionan...');
  
  try {
    const verification = await verifyExistingUsers();
    
    if (!verification.success) {
      throw new Error(verification.error);
    }
    
    const workingCredentials = [];
    
    // Buscar admin
    const admin = verification.allUsers.find(u => u.role === 'admin');
    if (admin) {
      workingCredentials.push({
        identifier: admin.username,
        password: 'Admin123!', // Asumir contraseña estándar
        role: 'admin',
        email: admin.email
      });
      
      if (admin.email) {
        workingCredentials.push({
          identifier: admin.email,
          password: 'Admin123!',
          role: 'admin',
          email: admin.email
        });
      }
    }
    
    // Buscar diseñadores
    const designers = verification.allUsers.filter(u => u.role === 'diseñador');
    designers.forEach(designer => {
      workingCredentials.push({
        identifier: designer.username,
        password: 'Designer123!', // Asumir contraseña estándar
        role: 'diseñador',
        email: designer.email
      });
      
      if (designer.email) {
        workingCredentials.push({
          identifier: designer.email,
          password: 'Designer123!',
          role: 'diseñador',
          email: designer.email
        });
      }
    });
    
    // Buscar clientes
    const clients = verification.allUsers.filter(u => u.role === 'cliente');
    clients.forEach(client => {
      workingCredentials.push({
        identifier: client.username,
        password: 'Cliente123!', // Asumir contraseña estándar
        role: 'cliente',
        email: client.email
      });
      
      if (client.email) {
        workingCredentials.push({
          identifier: client.email,
          password: 'Cliente123!',
          role: 'cliente',
          email: client.email
        });
      }
    });
    
    console.log(`✅ ${workingCredentials.length} credenciales encontradas:`);
    workingCredentials.forEach(cred => {
      console.log(`  ${cred.identifier} (${cred.role})`);
    });
    
    return {
      success: true,
      credentials: workingCredentials
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo credenciales:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testOnlyExistingUsers = async () => {
  console.log('🧪 Probando solo usuarios que existen...');
  
  try {
    const credentialsResult = await getWorkingCredentials();
    
    if (!credentialsResult.success) {
      throw new Error(credentialsResult.error);
    }
    
    const { authAPI } = await import('../api/auth');
    const results = [];
    
    for (const cred of credentialsResult.credentials) {
      try {
        console.log(`🔐 Probando: ${cred.identifier}...`);
        const response = await authAPI.login(cred.identifier, cred.password);
        
        const success = response.user && response.user.role === cred.role;
        results.push({
          identifier: cred.identifier,
          expectedRole: cred.role,
          actualRole: response.user?.role,
          success,
          message: success ? '✅ Login exitoso' : '❌ Rol incorrecto'
        });
        
        console.log(`${success ? '✅' : '❌'} ${cred.identifier}: ${response.user?.role}`);
        
      } catch (error) {
        results.push({
          identifier: cred.identifier,
          expectedRole: cred.role,
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
    
    return {
      total: totalTests,
      successful: successfulLogins,
      results
    };
    
  } catch (error) {
    console.error('❌ Error en pruebas de usuarios existentes:', error);
    return {
      total: 0,
      successful: 0,
      results: [],
      error: error.message
    };
  }
};

