const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const upload = formidable({
  dest: UPLOADS_DIR,
  limits: { fileSize: 10 * 1024 * 1024 } // limit file size to 10MB
});

const checkUploadsDirectory = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
  }
};

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    checkUploadsDirectory();

    const files = fs.readdirSync(UPLOADS_DIR);
    if (files.length > 0) {
      resolve({
        statusCode: 403,
        body: JSON.stringify({ message: 'A file is already uploaded and awaiting download.' }),
      });
      return;
    }

    const uploadMiddleware = upload.single('file');
    const req = { body: event.body, headers: event.headers };
    const res = {
      statusCode: 200,
      body: '',
      setHeader: () => { },
      end: (message) => {
        resolve({
          statusCode: 200,
          body: message,
        });
      },
    };

    uploadMiddleware(req, res, (err) => {
      if (err) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ message: 'File upload failed.', error: err.message }),
        });
        return;
      }

      res.end(JSON.stringify({ message: 'File uploaded successfully.' }));
    });
  });
};
