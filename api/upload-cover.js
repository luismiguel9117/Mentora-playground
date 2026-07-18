import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Missing filename or base64Data' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Vercel filesystem is read-only in production — suggest using a storage service
    try {
      const coversDir = path.resolve(process.cwd(), 'public/assets/covers');
      if (!fs.existsSync(coversDir)) {
        fs.mkdirSync(coversDir, { recursive: true });
      }
      const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9\.\-_]/g, '_');
      const uniqueFilename = `${Date.now()}_${cleanFilename}`;
      const filePath = path.join(coversDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);
      return res.status(200).json({ success: true, url: `/assets/covers/${uniqueFilename}` });
    } catch {
      // On Vercel read-only filesystem — return a data URL as fallback
      return res.status(200).json({
        success: true,
        url: base64Data, // Return the base64 data URL directly as the image src
        warning: 'En Vercel las imágenes no se pueden guardar permanentemente. Usa una URL de imagen externa (Cloudinary, ImgBB, etc.) para miniaturas persistentes.'
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
