const { google } = require('googleapis');
const creds = require('./creds.json');

const SPREADSHEET_ID = '1avgoX4-J-B6OntD2MqTmqz2FrPrrr7qpoJQ6uNEZfOQ';

async function getFormData() {
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'SHEET1!A2:E2', // Assume row with headers is A1:E1
  });

  const [firstName, lastName, email, gender, phone] = res.data.values[0];
  return { firstName, lastName, email, gender, phone };
}

async function logResult(success, message) {
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const timestamp = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'SHEET2!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[timestamp, success ? 'SUCCESS' : 'FAILURE', message]],
    }
  });
}

module.exports = { getFormData, logResult };
