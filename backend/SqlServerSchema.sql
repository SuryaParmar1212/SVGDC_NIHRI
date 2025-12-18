-- SQL Server Schema Script for SVGDC_NIHRI Project
-- Generated based on C# Models

-- Users Table
CREATE TABLE [Users] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Username] NVARCHAR(100) NOT NULL,
    [Email] NVARCHAR(100) NOT NULL,
    [PasswordHash] NVARCHAR(MAX) NOT NULL,
    [FullName] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(20) NOT NULL DEFAULT 'Student',
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [LastLoginDate] DATETIME2 NULL
);
GO

-- Admins Table
CREATE TABLE [Admins] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Username] NVARCHAR(100) NOT NULL,
    [Email] NVARCHAR(150) NOT NULL,
    [PasswordHash] NVARCHAR(MAX) NOT NULL,
    [FullName] NVARCHAR(150) NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [LastLoginDate] DATETIME2 NULL,
    [Role] NVARCHAR(50) NOT NULL DEFAULT 'Admin'
);
GO

-- Departments Table
CREATE TABLE [Departments] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(MAX) NOT NULL,
    [Category] NVARCHAR(50) NOT NULL,
    [HeadOfDepartment] NVARCHAR(100) NULL,
    [ImageUrl] NVARCHAR(500) NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Faculties Table
CREATE TABLE [Faculties] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Designation] NVARCHAR(100) NOT NULL,
    [Qualification] NVARCHAR(100) NOT NULL,
    [Email] NVARCHAR(100) NULL,
    [Phone] NVARCHAR(20) NULL,
    [ImageUrl] NVARCHAR(500) NULL,
    [Specialization] NVARCHAR(MAX) NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [DepartmentId] INT NOT NULL,
    CONSTRAINT [FK_Faculties_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE NO ACTION
);
GO

-- Students Table
CREATE TABLE [Students] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [RollNumber] NVARCHAR(50) NOT NULL,
    [FullName] NVARCHAR(100) NOT NULL,
    [Email] NVARCHAR(100) NOT NULL,
    [Phone] NVARCHAR(20) NULL,
    [DateOfBirth] DATETIME2 NOT NULL,
    [Gender] NVARCHAR(10) NOT NULL,
    [Address] NVARCHAR(MAX) NOT NULL,
    [Course] NVARCHAR(100) NOT NULL,
    [Semester] INT NOT NULL,
    [AdmissionYear] INT NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [UserId] INT NULL,
    [DepartmentId] INT NULL,
    CONSTRAINT [FK_Students_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Students_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE SET NULL
);
GO

-- Announcements Table
CREATE TABLE [Announcements] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(200) NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [ImageUrl] NVARCHAR(500) NULL,
    [AttachmentUrl] NVARCHAR(500) NULL,
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ExpiryDate] DATETIME2 NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [Priority] INT NOT NULL DEFAULT 0,
    [CreatedBy] NVARCHAR(100) NOT NULL
);
GO

-- CarouselItems Table
CREATE TABLE [CarouselItems] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [ImageUrl] NVARCHAR(500) NOT NULL,
    [Title] NVARCHAR(200) NULL,
    [SortOrder] INT NOT NULL DEFAULT 0,
    [IsActive] BIT NOT NULL DEFAULT 1
);
GO

-- News Table
CREATE TABLE [News] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(200) NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [ImageUrl] NVARCHAR(500) NULL,
    [PublishedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [IsActive] BIT NOT NULL DEFAULT 1,
    [Author] NVARCHAR(100) NOT NULL,
    [Category] NVARCHAR(50) NOT NULL
);
GO

-- Notices Table
CREATE TABLE [Notices] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(200) NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [AttachmentUrl] NVARCHAR(500) NULL,
    [PublishedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ExpiryDate] DATETIME2 NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [Category] NVARCHAR(50) NOT NULL,
    [Priority] INT NOT NULL DEFAULT 0
);
GO

-- Galleries Table
CREATE TABLE [Galleries] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    [Url] NVARCHAR(500) NOT NULL,
    [ThumbnailUrl] NVARCHAR(500) NULL,
    [Type] NVARCHAR(50) NOT NULL DEFAULT 'image',
    [UploadedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [IsActive] BIT NOT NULL DEFAULT 1,
    [DisplayOrder] INT NOT NULL DEFAULT 0
);
GO

-- Events Table
CREATE TABLE [Events] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NOT NULL,
    [EventDate] DATETIME2 NOT NULL,
    [EndDate] DATETIME2 NULL,
    [Venue] NVARCHAR(200) NULL,
    [ImageUrl] NVARCHAR(500) NULL,
    [Category] NVARCHAR(50) NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Pages Table
CREATE TABLE [Pages] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(200) NOT NULL,
    [Slug] NVARCHAR(200) NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [SidebarContent] NVARCHAR(MAX) NULL,
    [LayoutType] NVARCHAR(50) NOT NULL DEFAULT 'Standard',
    [BackgroundImageUrl] NVARCHAR(500) NULL,
    [MetaDescription] NVARCHAR(MAX) NULL,
    [IsPublished] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedDate] DATETIME2 NULL
);
GO

-- NavigationItems Table
CREATE TABLE [NavigationItems] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Title] NVARCHAR(100) NOT NULL,
    [Icon] NVARCHAR(50) NULL,
    [Link] NVARCHAR(200) NULL,
    [ParentId] INT NULL,
    [Order] INT NOT NULL DEFAULT 0,
    [IsActive] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [FK_NavigationItems_NavigationItems_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [NavigationItems] ([Id]) ON DELETE NO ACTION
);
GO
