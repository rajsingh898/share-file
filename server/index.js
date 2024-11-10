const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Initialize app 
const app = express();

app.use(cors({
  origin: 'https://share-file-client.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>File Sharing Service</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #000;
            color: #fff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .card {
            background-color: #f8f8f8;
            color: #333;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            width: 300px;
            max-width: 90%;
          }
          h1 {
            color: #333;
          }
          p {
            font-size: 1.1em;
            margin: 10px 0;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Welcome to the File Sharing Service!</h1>
          <p>Upload and share your files easily.</p>
          <p>To upload a file, go to <a href="/upload">/upload</a>.</p>
          <p>To download a file, use the pin provided at <a href="/download/:pin">/download/:pin</a>.</p>
          <p>Visit the live website: <a href="https://share-file-client.vercel.app/" target="_blank">File Sharing Service</a></p>
        </div>
      </body>
    </html>
  `);
});

const uploadDirectory = '/tmp/uploads/';  // Use Vercel's temporary directory

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`)
});

const upload = multer({ storage: storage });

// In-memory mapping of pins to file paths
const filePinMap = {};

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  const pin = crypto.randomBytes(4).toString('hex');  // Generate 8-character pin
  const filePath = path.join(uploadDirectory, req.file.filename);

  // Store the pin and file path in memory
  filePinMap[pin] = filePath;

  // Send the pin to the user
  res.json({ pin: pin });
});

// Download route
app.get('/download/:pin', (req, res) => {
  const pin = req.params.pin;

  // Check if the pin exists in the map
  const filePath = filePinMap[pin];

  if (!filePath) {
    return res.status(404).json({ error: 'File not found or invalid pin' });
  }

  // Send the file with an absolute path
  res.sendFile(path.resolve(filePath), (err) => {
    if (err) {
      res.status(500).json({ error: 'Error downloading file' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
