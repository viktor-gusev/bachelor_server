'use strict';

const DAL = require('./../core/DAL');
const Helper = require('./../core/Helper');

class User {

  constructor(params) {
    Helper.checkSchema(params, User.minSchema, 'User');
    return User.model(params);
  }

}

User.className = 'Users';
User.minSchema = {
  email: String,
  updateDate: {type: Date, default: Date.now}
};

User.model = db.model(
  User.className,
  new DAL.Schema(User.minSchema, {strict: false})
);

module.exports = User;
