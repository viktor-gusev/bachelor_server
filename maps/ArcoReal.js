'use strict';

const Parser = require('../core/ParserXML');
const ARCO_REAL_URL = 'http://www.arcoreal.lv/xml/export.php';

class ArcoReal extends Parser {

  constructor() {
    super(ARCO_REAL_URL);
  }

  start() {
    return this.getXML();
  }

  extractItems(xml) {
    return new Promise((resolve) => {
      this.items = xml.arco.objekts;
      this.items.forEach((el) => {
        this.extractUsers(el);
        this.extractAds(el);
      });
      resolve(true);
    });

  }

  extractAds(item) {
    try {
      let deals = '';
      // Ids were gotten from DB
      switch (item.$.type) {
        case 'sale':
          deals = 'sell';
          break;
        case 'rent':
          deals = 'rent';
          break;
        default:
          console.log(item.$.category + ' DEAL');
      }

      let category = '';
      // Ids were gotten from DB
      switch (item.$.category) {
        case 'house':
          category = 'house';
          break;
        case 'apartment':
          category = 'flat';
          break;
        case 'residentialLand':
        case 'businessLand':
        case 'arableLand':
          category = 'land';
          break;
        case 'commercialTrade':
        case 'investmentObject':
        case 'commercialBureau':
        case 'Factory':
        case '#Factory#commercialWarehouse':
        case 'Factory#commercialWarehouse':
          category = 'industrial';
          break;
        default:
          console.log(item.$.category + ' CATEGORY');
      }

      let images = [];
      if (item.images && item.images[0] && item.images[0].img) {
        item.images[0].img.forEach(img => {
          images.push({source: img.$.filename, alt: 'ArcoReal pic'});
        });
      }

      let data = {
        deal: deals,
        type: category,
        area: item.$.area,
        land: item.$.land,
        features: item.$.options.split('#').slice(1),
        images: images,
        description: item.$.description + '   ' + item.$.description_ru + '   ' + item.$.description_en,
        price: item.$.price,
        floor_number: item.$.floor,
        floors: item.$.total_floors,
        address: item.$.address_level_1 + ', ' + item.$.street + ' ' + item.$.house_no,
        rooms: item.$.roomcount,
        code: 'AR' + item.$.id,
        ownerEmail: item.kontaktpersona[0].$.email,
        origin: 'http://www.arcoreal.lv/lv/' + item.$.id,
        updateDate: Date.now()
      };
      this.ads.push(data);
    } catch (e) {
      //logger.error(e);
      // do nothing
    }
  }

  extractUsers(item) {
    try {
      let user = {
        email: item.kontaktpersona[0].$.email,
        name: item.kontaktpersona[0].$.name,
        surname: item.kontaktpersona[0].$.surname,
        phones: [item.kontaktpersona[0].$.phone, item.kontaktpersona[0].$.cellphone],
        company: 'ArcoReal',
        updateDate: Date.now()
      };
      this.users[user.email] = user;
    } catch (e) {
      //logger.error(e);
      // do nothing
    }
  }

}

module.exports = ArcoReal;
