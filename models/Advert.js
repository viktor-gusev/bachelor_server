'use strict';

const DAL = require('./../core/DAL');
const Helper = require('./../core/Helper');

class Advert {

  constructor(params) {
    Helper.checkSchema(params, Advert.minSchema, 'Advert');
    return Advert.model(params);
  }

}

Advert.className = 'Adverts';
Advert.minSchema = {
  code: String,
  address: String,
  price: Number,
  area: Number,
  updateDate: {type: Date, default: Date.now},
  deal: String, // sell, rent
  type: String // flat, house
};

Advert.model = db.model(
  Advert.className,
  new DAL.Schema(Advert.minSchema, {strict: false})
);

module.exports = Advert;
