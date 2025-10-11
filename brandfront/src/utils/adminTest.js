// Utilidad para probar endpoints de administración
import { adminAPI } from '../api/admin';
import { brandingAPI } from '../api/branding';
import { authAPI } from '../api/auth';

export const testAdminEndpoints = async () => {
  console.log('🧪 Iniciando pruebas de endpoints de admin...');
  
  try {
    // Probar endpoints GET
    console.log('📋 Probando GET /api/user/admin/users/...');
    const users = await adminAPI.users.list();
    console.log('✅ Usuarios obtenidos:', users);
    
    console.log('👨‍🎨 Probando GET /api/user/admin/designers/...');
    const designers = await adminAPI.users.listDesigners();
    console.log('✅ Diseñadores obtenidos:', designers);
    
    console.log('🎨 Probando GET /api/branding/services/...');
    const services = await brandingAPI.services.list();
    console.log('✅ Servicios obtenidos:', services);
    
    console.log('📁 Probando GET /api/branding/projects/...');
    const projects = await brandingAPI.projects.list();
    console.log('✅ Proyectos obtenidos:', projects);
    
    console.log('📄 Probando GET /api/branding/quotes/...');
    const quotes = await brandingAPI.quotes.list();
    console.log('✅ Cotizaciones obtenidas:', quotes);
    
    console.log('🎉 ¡Todas las pruebas GET pasaron exitosamente!');
    
    return {
      success: true,
      data: {
        users,
        designers,
        services,
        projects,
        quotes
      }
    };
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testPostOperations = async () => {
  console.log('🧪 Iniciando pruebas de operaciones POST...');
  
  try {
    // Primero verificar que el usuario esté autenticado y sea admin
    console.log('🔍 Verificando autenticación...');
    const profile = await authAPI.getProfile();
    console.log('👤 Usuario autenticado:', profile.username, 'Rol:', profile.role);
    
    if (profile.role !== 'admin') {
      throw new Error('Usuario no es admin. Rol actual: ' + profile.role);
    }
    
    console.log('✅ Usuario admin verificado');
    // Probar cambio de rol (si hay usuarios disponibles)
    const users = await adminAPI.users.list();
    if (users.users && users.users.length > 0) {
      const testUser = users.users.find(u => u.role !== 'admin') || users.users[0];
      
      console.log(`🔄 Probando cambio de rol para usuario ${testUser.username}...`);
      const originalRole = testUser.role;
      const newRole = originalRole === 'cliente' ? 'diseñador' : 'cliente';
      
      await adminAPI.users.setRole(testUser.id, newRole);
      console.log(`✅ Rol cambiado de ${originalRole} a ${newRole}`);
      
      // Restaurar rol original
      await adminAPI.users.setRole(testUser.id, originalRole);
      console.log(`✅ Rol restaurado a ${originalRole}`);
    }
    
    // Probar asignación de diseñador (si hay proyectos y diseñadores)
    const [projects, designers] = await Promise.all([
      brandingAPI.projects.list(),
      adminAPI.users.listDesigners()
    ]);
    
    if (projects.length > 0 && designers.designers && designers.designers.length > 0) {
      const unassignedProject = projects.find(p => !p.assigned_to);
      const designer = designers.designers[0];
      
      if (unassignedProject) {
        console.log(`👨‍🎨 Probando asignación de diseñador ${designer.username} al proyecto ${unassignedProject.id}...`);
        
        await adminAPI.projects.assignDesigner(unassignedProject.id, designer.id);
        console.log('✅ Diseñador asignado exitosamente');
        
        // Desasignar (esto requeriría un endpoint adicional)
        console.log('ℹ️ Asignación completada (desasignación no disponible)');
      }
    }
    
    console.log('🎉 ¡Todas las pruebas POST pasaron exitosamente!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error en pruebas POST:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para probar todo
export const runAllTests = async () => {
  console.log('🚀 Ejecutando todas las pruebas del panel de admin...');
  
  const getTests = await testAdminEndpoints();
  if (!getTests.success) {
    return getTests;
  }
  
  const postTests = await testPostOperations();
  return postTests;
};
