import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureUploadsDirectory = () => {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadsPath)) {
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log('Created uploads directory:', uploadsPath);
    } catch (error) {
      console.error('Error creating uploads directory:', error);
      process.exit(1);
    }
  }
  
  // Ensure directory has proper permissions
  try {
    fs.chmodSync(uploadsPath, 0o755);
    console.log('Set proper permissions for uploads directory');
  } catch (error) {
    console.error('Error setting directory permissions:', error);
    process.exit(1);
  }
};

export default ensureUploadsDirectory;
