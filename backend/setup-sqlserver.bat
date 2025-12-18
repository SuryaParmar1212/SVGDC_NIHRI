@echo off
echo ========================================
echo Database Setup Script (SQL Server)
echo ========================================
echo.

echo Step 1: Installing Entity Framework Core Tools...
dotnet tool install --global dotnet-ef 2>nul
if %errorlevel% neq 0 (
    echo EF Tools already installed, updating...
    dotnet tool update --global dotnet-ef
)
echo.

echo Step 2: Cleaning previous migrations (if any)...
if exist "Migrations" (
    echo Removing old migrations folder...
    rmdir /s /q Migrations
)
echo.

echo Step 3: Restoring NuGet packages...
dotnet restore
echo.

echo Step 4: Building the project...
dotnet build
if %errorlevel% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)
echo.

echo Step 5: Creating fresh database migration...
dotnet ef migrations add InitialCreate
if %errorlevel% neq 0 (
    echo Migration creation failed! Please check the errors above.
    pause
    exit /b 1
)
echo.

echo Step 6: Updating Database...
echo This will create the database and tables, and insert default Admin user.
echo NOTE: If you already created tables manually, this might fail unless you drop them first.
dotnet ef database update
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Database update failed!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Connection string incorrect (Check appsettings.json)
    echo 2. Database tables already exist (Drop the database in SSMS and try again)
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo SUCCESS! Database setup complete!
echo ========================================
echo.
echo Default credentials:
echo   Username: admin
echo   Password: Admin@123
echo.
echo Press any key to start the backend server...
pause
dotnet run
