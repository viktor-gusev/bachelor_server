'use strict';

const winston = require('winston');

class Logger {

  /**
   * @param serviceName - file name in logs/*.log
   * @param filesCount[5] - count files in logs/*.log
   * @returns {Logger}
   */
  static getLogger(serviceName, filesCount) {
    filesCount = filesCount ? filesCount : 5;
    let logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({level: 'debug'}),
        new (winston.transports.File)(
          {
            name: 'info-file',
            filename: __dirname + '/../logs/INFO_' + serviceName + '_' + new Date().toJSON().slice(0, 10) + '.log',
            level: 'info',
            // Max size: 1000 Mb, for up to 5
            maxsize: 104857600, maxFiles: filesCount
          }
        ),
        new (winston.transports.File)(
          {
            name: 'silly-file',
            filename: __dirname + '/../logs/SILLY_' + serviceName + '_' + new Date().toJSON().slice(0, 10) + '.log',
            level: 'silly',
            // Max size: 1000 Mb, for up to 5
            maxsize: 104857600, maxFiles: filesCount
          }
        )]
    });

    // Make logging asynchronous to reduce response time
    let log = (...msg) => {setTimeout(() => logger.log(...msg), 1000)};
    let error = (msg) => {setTimeout(() => logger.error(msg), 1000)};
    let warn = (msg) => {setTimeout(() => logger.warn(msg), 1000)};
    let info = (msg) => {setTimeout(() => logger.info(msg), 1000)};
    let verbose = (msg) => {setTimeout(() => logger.verbose(msg), 1000)};
    let debug = (msg) => {setTimeout(() => logger.debug(msg), 1000)};
    let silly = (msg) => {setTimeout(() => logger.silly(msg), 1000)};

    return {
      error: error,
      warn: warn,
      info: info,
      verbose: verbose,
      debug: debug,
      silly: silly,

      log: log
    };

  }

}

module.exports = Logger;
