const express = require('express');
const expressWinston = require('express-winston');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const animalRouter = require('./routes/animal');

const createApp = (logger) => {
  const app = express();
  app.use(expressWinston.logger({ winstonInstance: logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  const buildPath = path.normalize(path.join(__dirname, './client/build'));
  app.use(express.static(buildPath));

  app.use('/auth', authRouter);
  app.use('/animal', animalRouter);

  // catch 404 and forward to error handler
  app.use((req, res) => {
    res.status(404).send('Not found');
  });
  // error handler
  app.use((err, req, res) => {
    res.status(err.status || 500);
  });
  return app;
};
module.exports = createApp;