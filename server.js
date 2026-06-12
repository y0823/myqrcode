const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const sharp = require('sharp');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Multer config for logo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Generate a single QR Code image buffer with optional logo
 */
async function generateQRCodeBuffer(text, options, logoBuffer) {
  const size = parseInt(options.size) || 300;
  const margin = parseInt(options.margin) || 4;
  const colorDark = options.colorDark || '#000000';
  const colorLight = options.colorLight || '#ffffff';

  // Generate basic QR Code as buffer (PNG)
  const qrBuffer = await QRCode.toBuffer(text, {
    width: size,
    margin: margin,
    color: {
      dark: colorDark,
      light: colorLight
    },
    errorCorrectionLevel: 'H' // Highest error correction for logo embedding
  });

  if (!logoBuffer) {
    return qrBuffer;
  }

  try {
    // If we have a logo, composite it using sharp
    const logoSize = Math.floor(size * 0.25); // Logo takes up 25% of the QR code width
    const resizedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    return await sharp(qrBuffer)
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png()
      .toBuffer();
  } catch (error) {
    console.error('Error compositing logo:', error);
    return qrBuffer; // Fallback to normal QR code if logo fails
  }
}

// Routes
app.get('/api/generate', async (req, res) => {
  try {
    const { text, size, margin, colorDark, colorLight } = req.query;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const options = { size, margin, colorDark, colorLight };
    // GET requests usually don't support file uploads easily, so no logoBuffer
    const finalImageBuffer = await generateQRCodeBuffer(text, options, null);

    res.set('Content-Type', 'image/png');
    res.send(finalImageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.post('/api/generate', upload.single('logo'), async (req, res) => {
  try {
    const { text, size, margin, colorDark, colorLight } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const options = { size, margin, colorDark, colorLight };
    const logoBuffer = req.file ? req.file.buffer : null;

    const finalImageBuffer = await generateQRCodeBuffer(text, options, logoBuffer);

    res.set('Content-Type', 'image/png');
    res.send(finalImageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.post('/api/generate-batch', upload.single('logo'), async (req, res) => {
  try {
    let { texts, size, margin, colorDark, colorLight } = req.body;
    
    // Parse texts if sent as JSON string in form-data
    if (typeof texts === 'string') {
      try {
        texts = JSON.parse(texts);
      } catch(e) {
        // Assume comma separated or newline separated if not JSON
        texts = texts.split(/[,\n]+/).map(t => t.trim()).filter(t => t);
      }
    }

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    const options = { size, margin, colorDark, colorLight };
    const logoBuffer = req.file ? req.file.buffer : null;

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=qrcodes.zip'
    });

    const AdmZip = require('adm-zip');
    const zip = new AdmZip();

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const finalImageBuffer = await generateQRCodeBuffer(text, options, logoBuffer);
      
      // Clean filename
      let safeName = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
      if (!safeName) safeName = `qrcode_${i}`;
      
      zip.addFile(`${safeName}.png`, finalImageBuffer, `QR Code for ${text}`);
    }

    const zipBuffer = zip.toBuffer();
    res.send(zipBuffer);

  } catch (error) {
    console.error(error);
    // Note: If headers are already sent, you can't send status 500
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate batch QR codes' });
    }
  }
});

app.listen(port, () => {
  console.log(`QR Code API Server running on http://localhost:${port}`);
});
