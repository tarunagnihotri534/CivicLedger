@echo off
echo.
echo ========================================
echo    CivicLedger - Complete Setup
echo ========================================
echo.
echo Starting CivicLedger with REAL-TIME backend...
echo.

echo [1/3] Starting Backend Server...
cd backend-server
start "CivicLedger Backend" cmd /k "npm start"
cd ..

echo [2/3] Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend Server...
start "CivicLedger Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    CivicLedger is Starting Up!
echo ========================================
echo.
echo Backend Server: http://localhost:3001
echo Frontend Server: http://localhost:8080
echo.
echo Available Routes:
echo - Main App: http://localhost:8080/
echo - Dashboard: http://localhost:8080/dashboard
echo - DAO Voting: http://localhost:8080/voting
echo.
echo Backend Health Check: http://localhost:3001/health
echo.
echo ========================================
echo    CivicLedger = Trust through Transparency
echo ========================================
echo.
echo Press any key to open the main application...
pause > nul
start http://localhost:8080/dashboard 