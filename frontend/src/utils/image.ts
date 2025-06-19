// Helper function to get the full URL for uploaded images
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '/placeholder.svg'; // Return a placeholder image if no image path is provided
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the API URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  return `${baseUrl}/uploads/${imagePath}`;
};
