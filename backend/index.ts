import express from 'express';
import app from './app';
import config from './utils/config';
import logger from './utils/logger';
import path from 'path';

const buildPath = path.join(__dirname, '../..', 'frontend', 'build');


app.use('/room/*',express.static(buildPath));

app.use(express.static(buildPath));



app.get('/', function (_req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
