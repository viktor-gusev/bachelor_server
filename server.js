'use strict';

const express = require('express');
const app = express();

const Config = require('./config');
const DAL = require('./core/DAL');

const winston = require('./core/Logger');
global.logger = winston.getLogger('PARSER');

global.db = DAL.createDbConnection(
  Config.MONGODB.user,
  Config.MONGODB.password,
  Config.MONGODB.host,
  Config.MONGODB.db);

db.on('error', logger.error.bind(logger, 'Mongo DB connection error!'));
db.once('open', () => {

  const Advert = require('./models/Advert');

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, params, sort");
    next();
  });

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/ads', (req, res) => {
    let params = {};
    let sort = {};
    try {
      params = JSON.parse(req.headers.params);
      sort = JSON.parse(req.headers.sort)
    } catch (e) {
      logger.info(e)
    }
    Advert.model.find(params).limit(30).sort(sort).exec((err, result) => {
      if (err) {
        logger.error(err);
        res.send('error');
      } else {
        res.send(JSON.stringify(result));
      }
    });
  });

  app.listen(3000, () => {
    logger.info('Example app listening on port 3000!');
  });
});