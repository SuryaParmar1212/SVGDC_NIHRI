@echo off
echo ========================================
echo Database Setup Script - Fixed Version
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

echo Step 6: Reviewing migration...
echo Please review the migration file in the Migrations folder.
echo Press any key to continue with database update...
pause
echo.

echo Step 7: Applying migration to Neon PostgreSQL database...
dotnet ef database update --verbose
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Database update failed!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Check your database connection string in appsettings.json
    echo 2. Ensure Neon DB is accessible and credentials are correct
    echo 3. Verify your internet connection
    echo 4. Check if the database already exists
    echo.
    echo Current connection string should be:
    echo Host=ep-misty-heart-a15rlv5u-pooler.ap-southeast-1.aws.neon.tech
    echo Database=neondb
    echo Username=neondb_owner
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo SUCCESS! Database setup complete!
echo ========================================
echo.
echo Your Neon PostgreSQL database now has:
echo   - Admins table (with default admin user)
echo   - News table (with sample news)
echo   - Announcements table (with sample announcement)
echo   - Departments table (with 3 departments)
echo   - And all other tables
echo.
echo Default admin credentials:
echo   Username: admin
echo   Password: Admin@123
echo   Email: admin@nihricollege.edu
echo.
echo Next steps:
echo 1. Run 'dotnet run' to start the backend on port 5018
echo 2. Access Swagger at: http://localhost:5018/swagger
echo 3. Login to admin panel at: http://localhost:4200/admin/login
echo.
echo Press any key to start the backend server...
pause
dotnet run
