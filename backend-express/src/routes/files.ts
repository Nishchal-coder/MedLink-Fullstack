import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authenticate, requireUser } from '../middleware/auth';
import { auditCreate, auditDelete } from '../middleware/audit';
import { FileAsset, Patient } from '../models';
import { IAuthRequest } from '../types';
import {uploadOnCloudinary} from '../utils/cloudinary.utils';
const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow only image files and PDFs
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// All routes require authentication
router.use(authenticate);

// Upload medical report image
router.post('/upload', requireUser, upload.single('file'), auditCreate, async (req: IAuthRequest, res) => {
  try {
    const user = req.user!;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const image = req.file.path;
    console.log(image);

    // Get patient for this user
    const patient = await Patient.findOne({ user: user._id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    // Calculate file hash BEFORE uploading to Cloudinary (since Cloudinary deletes the file)
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Upload to Cloudinary (this will delete the local file)
    const uploadImage = await uploadOnCloudinary(image);
    console.log(uploadImage);

    // Check if Cloudinary upload was successful
    if (!uploadImage || (typeof uploadImage === 'string' && uploadImage.includes('Error'))) {
      return res.status(500).json({ error: 'Failed to upload file to cloud storage' });
    }

    // Create file asset record
    const fileAsset = new FileAsset({
      patient: patient._id,
      hospital: patient.hospital,
      uploadedBy: user._id,
      file: req.file.filename,
      fileType: req.file.mimetype.startsWith('image/') ? 'image' : 'pdf',
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      sha256: hash,
      image: typeof uploadImage === 'object' && uploadImage !== null ? uploadImage.secure_url : null,
    });

    await fileAsset.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      fileAsset: {
        id: fileAsset._id,
        filename: fileAsset.originalFilename,
        fileType: fileAsset.fileType,
        fileSize: fileAsset.fileSize,
        uploadedAt: fileAsset.uploadedAt
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get user's uploaded files
router.get('/my-files', requireUser, async (req: IAuthRequest, res) => {
  try {
    const user = req.user!;
    
    // Get patient for this user
    const patient = await Patient.findOne({ user: user._id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const files = await FileAsset.find({ patient: patient._id })
      .sort({ uploadedAt: -1 });

    res.json({
      files: files.map(file => ({
        id: file._id,
        filename: file.originalFilename,
        fileType: file.fileType,
        fileSize: file.fileSize,
        uploadedAt: file.uploadedAt,
        mimeType: file.mimeType,
        image: file.image // Include Cloudinary URL
      }))
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Download file
router.get('/download/:id', requireUser, async (req: IAuthRequest, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Get patient for this user
    const patient = await Patient.findOne({ user: user._id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const fileAsset = await FileAsset.findById(id);
    if (!fileAsset) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user owns this file
    if (fileAsset.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.join(__dirname, '../../uploads', fileAsset.file);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(filePath, fileAsset.originalFilename);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file
router.delete('/:id', requireUser, auditDelete, async (req: IAuthRequest, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Get patient for this user
    const patient = await Patient.findOne({ user: user._id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const fileAsset = await FileAsset.findById(id);
    if (!fileAsset) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user owns this file
    if (fileAsset.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', fileAsset.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await FileAsset.findByIdAndDelete(id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
