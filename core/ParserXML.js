'use strict';

const http = require('http');
const parseString = require('xml2js').parseString;

//const geocoder = require('geocoder');
//const OpenGeocoder = require('node-open-geocoder');
//const geo = new OpenGeocoder('dev.riga.fm', 8090);

let i = 0;
class ParserXML {

  constructor(url) {
    this.url = url;

    this.items = {};
    this.ads = [];
    this.users = {};
  }

  getXML() {
    return new Promise((resolve, reject) => {
      http.get(this.url, (res) => {
        // save the data
        let xml = '';
        res.on('data', (chunk) => {
          xml += chunk;
        });
        res.on('end', () => {
          // parse xml
          parseString(xml, (err, result) => {
            this.extractItems(result).then(this.parse.bind(this), err => reject).then(resolve);
          });
        });
      });
    });
  }

  parse() {
    return new Promise((resolve, reject) => {
      let usersPromiseArr = [];
      Object.keys(this.users).forEach((user) => {
        usersPromiseArr.push(this.getUser(this.users[user]));
      });
      // create new users
      Promise.all(usersPromiseArr).then(res => {
        // replace user info with database id
        res.forEach(el => {
          this.users[el.email] = el._id;
        });

        let promiseArr = [];
        this.ads.forEach((item) => {
          promiseArr.push(this.createItem(item));
        });
        // create new ads
        Promise.all(promiseArr).then(res => {
            console.log(JSON.stringify(res));
            console.log('Total: ' + i);
            resolve(JSON.stringify(res) + ' Total: ' + i)
          }
        );
      });
    });

  }

  /**
   * create inner ad
   * @param item
   * @returns {Promise}
   */
  createItem(item) {
    return new Promise((resolve) => {

      const Advert = require('../models/Advert');
      Advert.model.findOne({code: item.code}, '', (err, ad) => {
        if (ad)
          resolve();
        else
          new Advert(item).save(err => {
            if (err)
              logger.error(err);
            else
              resolve(item);
          });
      });

    });
  }

  /**
   * return Promise - Id of user
   * Create it if user was not existed
   */
  getUser(user) {
    return new Promise((resolve) => {

      const User = require('../models/User');
      let createUser = (user) => {
        return new Promise((resolve) => {
          try {
            var usr = new User(user);
          } catch (e) {
            logger.error(e)
          }
          usr.save(
              err => {
              if (err)
                logger.error(err);
              else
                resolve(usr);
            }
          );
        });
      };

      User.model.findOne({email: user.email}, 'email _id', (err, res) => {
        if (err || !res) {
          createUser(user).then(resolve).catch(logger.log);
        } else {
          resolve(res);
        }
      });

    });
  }

}

module.exports = ParserXML;
