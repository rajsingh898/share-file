const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`)
});

const upload = multer({ storage: storage });

const filePinMap = {};

app.post('/upload', upload.single('file'), (req, res) => {
  const pin = crypto.randomBytes(4).toString('hex');
  const filePath = path.join(uploadDirectory, req.file.filename);
  filePinMap[pin] = filePath;
  res.json({ pin: pin });
});

module.exports = (req, res) => {
  app(req, res);
};
