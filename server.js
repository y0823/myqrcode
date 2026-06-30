const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const sharp = require('sharp');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
  }
}));

// Multer config for logo uploads with 500KB limit
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 } // 500 KB limit for logo
});

/**
 * Generate a single QR Code image buffer with optional logo (PNG)
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

/**
 * Generate a single QR Code SVG string with optional logo
 */
async function generateQRCodeSVG(text, options, logoBuffer, logoMimeType) {
  const margin = parseInt(options.margin) || 4;
  const colorDark = options.colorDark || '#000000';
  const colorLight = options.colorLight || '#ffffff';

  let qrSvg = await QRCode.toString(text, {
    type: 'svg',
    margin: margin,
    color: {
      dark: colorDark,
      light: colorLight
    },
    errorCorrectionLevel: 'H' // Highest error correction for logo embedding
  });

  if (!logoBuffer) {
    return qrSvg;
  }

  try {
    const match = qrSvg.match(/viewBox="([^"]+)"/);
    if (match) {
      const viewBox = match[1].split(' ').map(Number);
      const w = viewBox[2];
      const h = viewBox[3];
      
      // Logo size (22% of QR width to prevent scanner obstruction)
      const logoSize = w * 0.22;
      const x = (w - logoSize) / 2;
      const y = (h - logoSize) / 2;
      
      const mime = logoMimeType || 'image/png';
      const logoDataUrl = `data:${mime};base64,${logoBuffer.toString('base64')}`;
      
      // Embed white (or colorLight) background rect and the logo image
      const logoSvgElements = `
  <rect x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" fill="${colorLight}" rx="${logoSize * 0.15}" />
  <image x="${x + logoSize * 0.05}" y="${y + logoSize * 0.05}" width="${logoSize * 0.9}" height="${logoSize * 0.9}" href="${logoDataUrl}" />
`;
      qrSvg = qrSvg.replace('</svg>', `${logoSvgElements}</svg>`);
    }
    return qrSvg;
  } catch (error) {
    console.error('Error generating SVG with logo:', error);
    return qrSvg;
  }
}

// Routes
app.get('/api/generate', async (req, res) => {
  try {
    const { text, size, margin, colorDark, colorLight, format } = req.query;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > 500) {
      return res.status(400).json({ error: 'Text length cannot exceed 500 characters' });
    }

    const options = { size, margin, colorDark, colorLight };
    if (options.size > 1000) options.size = 1000;

    if (format === 'svg') {
      const finalSvgString = await generateQRCodeSVG(text, options, null, null);
      res.set('Content-Type', 'image/svg+xml');
      res.send(finalSvgString);
    } else {
      const finalImageBuffer = await generateQRCodeBuffer(text, options, null);
      res.set('Content-Type', 'image/png');
      res.send(finalImageBuffer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.post('/api/generate', upload.single('logo'), async (req, res) => {
  try {
    const { text, size, margin, colorDark, colorLight, format } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > 500) {
      return res.status(400).json({ error: 'Text length cannot exceed 500 characters' });
    }

    const options = { size, margin, colorDark, colorLight };
    if (options.size > 1000) options.size = 1000;
    const logoBuffer = req.file ? req.file.buffer : null;
    const logoMimeType = req.file ? req.file.mimetype : null;

    if (format === 'svg') {
      const finalSvgString = await generateQRCodeSVG(text, options, logoBuffer, logoMimeType);
      res.set('Content-Type', 'image/svg+xml');
      res.send(finalSvgString);
    } else {
      const finalImageBuffer = await generateQRCodeBuffer(text, options, logoBuffer);
      res.set('Content-Type', 'image/png');
      res.send(finalImageBuffer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Rate limiter for batch generation: Max 5 requests per minute per IP
const batchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: { error: '请求过于频繁，请稍后再试' }
});

app.post('/api/generate-batch', batchLimiter, upload.single('logo'), async (req, res) => {
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

    if (texts.length > 100) {
      return res.status(400).json({ error: 'Max 100 items allowed per batch' });
    }
    if (texts.some(t => t.length > 100)) {
      return res.status(400).json({ error: 'Text length cannot exceed 100 characters per item' });
    }

    const options = { size, margin, colorDark, colorLight };
    if (options.size > 500) options.size = 500;
    const logoBuffer = req.file ? req.file.buffer : null;

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=qrcodes.zip'
    });

    let archive;
    if (typeof archiver === 'function') {
      archive = archiver('zip', { zlib: { level: 9 } });
    } else {
      archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    }
    archive.on('error', function(err) {
      throw err;
    });
    
    // Pipe archive data to the response
    archive.pipe(res);

    // Concurrency control: process 5 items at a time
    const CONCURRENCY = 5;
    for (let i = 0; i < texts.length; i += CONCURRENCY) {
      const batch = texts.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map(async (text, index) => {
        const realIndex = i + index;
        const finalImageBuffer = await generateQRCodeBuffer(text, options, logoBuffer);
        
        // Clean filename (allow Chinese, replace invalid path characters)
        let safeName = text.substring(0, 30).replace(/[\/\\:*?"<>|]/g, '_').trim();
        if (!safeName) safeName = `qrcode_${realIndex + 1}`;
        // Ensure filenames are somewhat unique by appending index
        safeName = `${safeName}_${realIndex + 1}`;
        
        archive.append(finalImageBuffer, { name: `${safeName}.png` });
      }));
    }

    archive.finalize();

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
