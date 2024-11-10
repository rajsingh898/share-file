const express = require('express');
const path = require('path');

const app = express();
const filePinMap = {};

app.get('/download/:pin', (req, res) => {
  const pin = req.params.pin;
  const filePath = filePinMap[pin];

  if (!filePath) {
    return res.status(404).json({ error: 'File not found or invalid pin' });
  }

  res.sendFile(path.resolve(filePath), (err) => {
    if (err) {
      res.status(500).json({ error: 'Error downloading file' });
    }
  });
});

module.exports = (req, res) => {
  app(req, res);
};
