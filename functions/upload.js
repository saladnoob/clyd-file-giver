const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const upload = multer({ dest: UPLOADS_DIR });

exports.handler = upload.single('file'), async (event) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR);
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    if (files.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Can\'t upload. Try again later.' }),
      };
    }

    if (!event.file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No file uploaded.' }),
      };
    }

    const uploadedFilePath = path.join(UPLOADS_DIR, event.file.filename);
    fs.renameSync(event.file.path, uploadedFilePath);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully!' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};
