const serverless = require('serverless-http');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: '/tmp/uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join('/tmp/uploads', file.filename);

  res.download(filePath, file.originalname, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error downloading file' });
    }

    // Delete the file after download
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

module.exports.handler = serverless(app);
