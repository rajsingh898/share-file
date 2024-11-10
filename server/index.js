

const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const cors = require('cors');



// Initialize  app 
const app = express();

app.use(cors({
  origin : 'https://share-file-client.vercel.app',
  methods : ["POST","GET"],
  credentials : true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://share-file-client.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const uploadDirectory = 'uploads/';

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)){
  fs.mkdirSync(uploadDirectory);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`)
});

const upload = multer({ storage: storage });

// In-memory mapping of pins to file paths
const filePinMap = {};

module.exports = async (req, res) => {
  // Set the CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://share-file-client.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your original request handler code
  if (req.method === 'POST') {
    
// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  const pin = crypto.randomBytes(4).toString('hex');  // Generate 8-character pin
  const filePath = path.join(uploadDirectory, req.file.filename);

  // Store the pin and file path in memory
  filePinMap[pin] = filePath;

  // Send the pin to the user
  res.json({ pin: pin });
});
  } else if (req.method === 'GET') {
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

  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};



  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Root route for testing the server
app.get('/', (req, res) => {
    res.send('Welcome to the file-sharing service. Use /upload to upload files and /download/:pin to download them.');
  });
  