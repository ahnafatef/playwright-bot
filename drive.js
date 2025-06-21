const fs = require('fs');
const fse = require('fs-extra');
const { google } = require('googleapis');
const creds = require('./creds.json');

async function downloadFile(destPath) {
  const FILE_ID = '18Mh-DaqufZjtbCNR5c_kpkv16uysmekh';
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });

  const drive = google.drive({ version: 'v3', auth });

  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.get(
    { fileId: FILE_ID, alt: 'media' },
    { responseType: 'stream' }
  );

  await new Promise((resolve, reject) => {
    res.data
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .pipe(dest);
  });
}

module.exports = { downloadFile };
