// Helper function to get the full URL for uploaded images
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '';
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the uploads URL
  // Construct the full URL for the image
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}/uploads/${imagePath}`;
};
