'use strict';

class Helper {

  static checkSchema(params, schema, className) {
    for (let key in schema)
      if (!params.hasOwnProperty(key))
        throw new Error(`Key ${key} is missing for ${className} schema!`)
  }

}


module.exports = Helper;
