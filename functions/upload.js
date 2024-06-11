const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const upload = multer({ dest: UPLOADS_DIR });

const handler = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    if (files.length > 1) {
      fs.unlinkSync(req.file.path); // Delete newly uploaded file if there's already an existing one
      return res.status(400).json({ message: 'Can\'t upload. Try again later.' });
    }

    res.status(200).json({ message: 'File uploaded successfully!' });
  });
};

module.exports = { handler };
