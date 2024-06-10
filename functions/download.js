const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    const { filename } = event.queryStringParameters;
    const filepath = path.join('/tmp', filename);

    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                reject({
                    statusCode: 404,
                    body: 'File not found'
                });
                return;
            }

            resolve({
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${filename}"`
                },
                body: data.toString('base64'),
                isBase64Encoded: true
            });

            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        });
    });
};
