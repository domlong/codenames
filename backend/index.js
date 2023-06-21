const express = require('express')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const path = require('path');

const buildPath = path.join(__dirname, '..', 'frontend', 'build')

app.use(express.static(buildPath));

app.get('/', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
