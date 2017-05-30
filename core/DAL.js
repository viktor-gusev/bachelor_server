'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const autoIncrement = require('mongoose-auto-increment');

class DAL {

  static createDbConnection(user, password, host, db) {
    mongoose.connect('mongodb://' + user + ':' +
      password + '@' + host + '/' + db);
    autoIncrement.initialize(mongoose.connection);
    return mongoose.connection;
  }

}

DAL.autoIncrement = autoIncrement;

DAL.Schema = mongoose.Schema;
DAL.ObjectId = mongoose.Types.ObjectId;

module.exports = DAL;
