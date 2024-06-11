const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

exports.handler = async (event, context) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR);
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    return {
      statusCode: 200,
      body: JSON.stringify({ fileExists: files.length > 0
