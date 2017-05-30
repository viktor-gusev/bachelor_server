'use strict';

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
  logger.info('Connection to Mongo established');

  const Parser = require('./maps/ArcoReal');
  let parserArco = new Parser;

  const Starlex = require('./maps/Starlex');
  let parserStarlex = new Starlex;

  Promise.all([
    parserArco.start(),
    parserStarlex.start()
  ])
    .then(res => process.exit(0));

});
