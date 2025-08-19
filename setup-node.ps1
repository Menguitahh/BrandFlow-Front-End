# Script para configurar Node.js en el PATH
Write-Host "Configurando Node.js en el PATH..." -ForegroundColor Green

# Agregar Node.js al PATH del usuario
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*nodejs*") {
    $newUserPath = "C:\Program Files\nodejs;" + $userPath
    [Environment]::SetEnvironmentVariable("PATH", $newUserPath, "User")
    Write-Host "Node.js agregado al PATH del usuario" -ForegroundColor Yellow
}

# Agregar Node.js al PATH de la sesión actual
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Verificar la instalación
Write-Host "Verificando Node.js..." -ForegroundColor Green
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error al verificar Node.js" -ForegroundColor Red
}

try {
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error al verificar npm" -ForegroundColor Red
}

Write-Host "Configuración completada. Por favor, reinicia Cursor." -ForegroundColor Green 