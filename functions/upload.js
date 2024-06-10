const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: '/tmp/' });

exports.handler = async (event, context) => {
    return new Promise((resolve, reject) => {
        upload.single('file')(event, context, (err) => {
            if (err) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ success: false, error: err.message })
                });
                return;
            }

            const file = event.file;
            if (!file) {
                resolve({
                    statusCode: 400,
                    body: JSON.stringify({ success: false })
                });
                return;
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({ success: true, url: `/.netlify/functions/download?filename=${file.filename}` })
            });
        });
    });
};
