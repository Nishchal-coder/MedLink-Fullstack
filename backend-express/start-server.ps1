# PowerShell script to start the MedLink backend server with correct configuration
$env:PORT = "5001"
$env:MONGODB_URI = "mongodb://localhost:27017/medlink"
$env:NODE_ENV = "development"

Write-Host "🚀 Starting MedLink Backend Server..." -ForegroundColor Green
Write-Host "📊 Port: $env:PORT" -ForegroundColor Yellow
Write-Host "🗄️  Database: $env:MONGODB_URI" -ForegroundColor Yellow
Write-Host "🌍 Environment: $env:NODE_ENV" -ForegroundColor Yellow
Write-Host ""

# Start the server
node dist/server.js
