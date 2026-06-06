const express = require('express');
const cors = require('cors');
const path = require('path');
const upload = require('./config/multerConfig');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', (req, res) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof require('multer').MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 2MB.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ message: 'Invalid file type. Only png, jpg, jpeg are allowed.' });
        }
      }
      return res.status(500).json({ message: 'Upload failed.', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided. Please attach a file with key "file".' });
    }

    const { filename, size, mimetype } = req.file;
    const filePath = `/uploads/${filename}`;

    console.log('Uploaded file:', { filename, size, mimetype });

    return res.status(200).json({
      message: 'Upload successful',
      fileName: filename,
      filePath
    });
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
