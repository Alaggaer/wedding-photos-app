import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { getPhotosData, savePhotoData } from '../utils/storage.js';

export const handlePhotoUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Aucune photo fournie' });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const outputPath = path.join('uploads', filename);

    // Optimiser et redimensionner l'image
    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    // Sauvegarder les métadonnées
    const photoData = {
      id: Date.now(),
      filename,
      originalName: req.file.originalname,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    await savePhotoData(photoData);

    res.json({
      status: 'success',
      data: photoData
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la photo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du traitement de la photo'
    });
  }
};

export const getAllPhotos = async (req, res) => {
  try {
    const photos = await getPhotosData();
    res.json({
      status: 'success',
      data: photos
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des photos'
    });
  }
};

export const likePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photos = await getPhotosData();
    const photoIndex = photos.findIndex(p => p.id === parseInt(id));

    if (photoIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Photo non trouvée'
      });
    }

    photos[photoIndex].likes += 1;
    await savePhotoData(photos);

    res.json({
      status: 'success',
      data: photos[photoIndex]
    });
  } catch (error) {
    console.error('Erreur lors du like de la photo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du like de la photo'
    });
  }
};