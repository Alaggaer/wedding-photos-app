import express from 'express';
import multer from 'multer';
import { handlePhotoUpload, getAllPhotos, likePhoto } from '../controllers/photoController.js';
import { uploadConfig } from '../utils/upload.js';

export const photoRouter = express.Router();
const upload = multer(uploadConfig);

// Routes pour les photos
photoRouter.post('/upload', upload.single('photo'), handlePhotoUpload);
photoRouter.get('/', getAllPhotos);
photoRouter.post('/:id/like', likePhoto);