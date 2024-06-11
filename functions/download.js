const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

exports.handler = async (event, context) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    if (files.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No file to download.' }),
      };
    }

    const filePath = path.join(UPLOADS_DIR, files[0]);
    const fileStream = fs.createReadStream(filePath);

    // Set up response headers
    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${files[0]}`,
    };

    return {
      statusCode: 200,
      headers,
      body: fileStream,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  } finally {
    // Delete the file after download
    fs.unlinkSync(filePath);
  }
};
