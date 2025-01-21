const API_URL = 'http://localhost:3000/api';

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  try {
    const response = await fetch(`${API_URL}/photos/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur upload:', error);
    throw error;
  }
};

export const getAllPhotos = async () => {
  try {
    const response = await fetch(`${API_URL}/photos`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des photos');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Erreur getAllPhotos:', error);
    throw error;
  }
};

export const likePhoto = async (photoId) => {
  try {
    const response = await fetch(`${API_URL}/photos/${photoId}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors du like');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur like:', error);
    throw error;
  }
};