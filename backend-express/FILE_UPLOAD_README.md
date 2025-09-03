# File Upload Feature

## Overview
The file upload feature allows patients to upload medical reports, images, and documents to their medical history. This includes X-rays, lab results, prescriptions, and other medical documents.

## Features
- **Secure File Upload**: Only authenticated users can upload files
- **File Type Validation**: Supports images (JPEG, PNG, GIF, WebP) and PDFs
- **File Size Limits**: Maximum 10MB per file
- **File Management**: Users can view, download, and delete their uploaded files
- **Image Preview**: Images can be viewed in a modal overlay
- **File Security**: Files are stored with SHA256 hashing for integrity

## API Endpoints

### Upload File
```
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: FormData with 'file' field
```

### Get User's Files
```
GET /api/files/my-files
Authorization: Bearer <token>
```

### Download File
```
GET /api/files/download/:id
Authorization: Bearer <token>
```

### Delete File
```
DELETE /api/files/:id
Authorization: Bearer <token>
```

## File Storage
- Files are stored in the `uploads/` directory
- Each file gets a unique filename to prevent conflicts
- File metadata is stored in the MongoDB `FileAsset` collection
- Files are associated with the patient's account

## Security Features
- Authentication required for all file operations
- Users can only access their own files
- File type validation prevents malicious uploads
- File size limits prevent abuse
- SHA256 hashing ensures file integrity

## Frontend Integration
The UserPanel component now includes:
- File upload button in the Medical History section
- Grid display of uploaded files
- Image preview modal
- Download and delete functionality
- File type indicators (image vs document)

## Usage
1. Navigate to the Patient Portal
2. Go to the Medical History section
3. Click "Upload Report" to select a file
4. View uploaded files in the grid below
5. Click "View" to preview images
6. Click "Download" to save files locally
7. Click the trash icon to delete files

## File Types Supported
- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF
- **Size Limit**: 10MB per file

## Database Schema
Files are stored using the `FileAsset` model with the following fields:
- `patient`: Reference to the patient
- `hospital`: Reference to the hospital
- `uploadedBy`: Reference to the user who uploaded
- `file`: Filename on disk
- `fileType`: Type of file (image/pdf)
- `originalFilename`: Original filename
- `fileSize`: File size in bytes
- `mimeType`: MIME type
- `sha256`: File hash for integrity
- `uploadedAt`: Upload timestamp
