const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const uploadDirectory = 'uploads/';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`)
});

const upload = multer({ storage: storage });

module.exports = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload file' });
    }
    const pin = crypto.randomBytes(4).toString('hex'); // Generate pin
    const filePath = path.join(uploadDirectory, req.file.filename);

    res.status(200).json({ pin: pin });
  });
};
