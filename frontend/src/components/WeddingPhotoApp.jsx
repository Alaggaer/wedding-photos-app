import React, { useState, useEffect } from 'react';
import { Camera, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadPhoto, getAllPhotos, likePhoto } from '@/api/photos';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const WeddingPhotoApp = () => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const loadedPhotos = await getAllPhotos();
      setPhotos(loadedPhotos);
    } catch (error) {
      setError("Erreur lors du chargement des photos");
      console.error('Erreur chargement:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    
    try {
      const result = await uploadPhoto(file);
      setPhotos(prev => [...prev, result.data]);
    } catch (error) {
      setError("Erreur lors de l'upload de la photo");
      console.error('Erreur upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (photoId) => {
    try {
      const result = await likePhoto(photoId);
      setPhotos(photos.map(photo => 
        photo.id === photoId ? result.data : photo
      ));
    } catch (error) {
      setError("Erreur lors du like de la photo");
      console.error('Erreur like:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif">Notre Mariage</CardTitle>
          <CardDescription>Partagez vos moments précieux</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center mb-8">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <span>Chargement...</span>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Ajouter une photo</span>
                  </>
                )}
              </Button>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <img
                  src={`http://localhost:3000/${photo.filename}`}
                  alt="Photo de mariage"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {new Date(photo.timestamp).toLocaleTimeString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:text-pink-400"
                      onClick={() => handleLike(photo.id)}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{photo.likes}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeddingPhotoApp;