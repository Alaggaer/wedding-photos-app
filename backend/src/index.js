import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { photoRouter } from './routes/photos.js';
import { setupStorage } from './utils/storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Initialiser le stockage
setupStorage();

// Routes
app.use('/api/photos', photoRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Une erreur est survenue sur le serveur'
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});