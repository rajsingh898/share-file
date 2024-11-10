const path = require('path');
const fs = require('fs');

// In-memory mapping of pins to file paths
const filePinMap = {};

module.exports = (req, res) => {
  const pin = req.query.pin;

  const filePath = filePinMap[pin];
  
  if (!filePath) {
    return res.status(404).json({ error: 'File not found or invalid pin' });
  }

  res.sendFile(path.resolve(filePath), (err) => {
    if (err) {
      res.status(500).json({ error: 'Error downloading file' });
    }
  });
};
