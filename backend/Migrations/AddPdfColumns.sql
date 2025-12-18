-- Add PDF/Attachment columns to News table
ALTER TABLE News
ADD PdfUrl NVARCHAR(500) NULL;

-- Add PDF/Attachment columns to Announcements table (if not already exists)
-- The AttachmentUrl column should already exist based on previous schema
-- If not, uncomment the line below:
-- ALTER TABLE Announcements
-- ADD AttachmentUrl NVARCHAR(500) NULL;

-- Verify the changes
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'News' AND COLUMN_NAME = 'PdfUrl';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Announcements' AND COLUMN_NAME = 'AttachmentUrl';
