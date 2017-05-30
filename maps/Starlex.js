'use strict';

const Parser = require('../core/ParserXML');
const STARLEX_URL = 'http://starlex.lv/mans24.php';

class Starlex extends Parser {

  constructor() {
    super(STARLEX_URL);
  }

  start() {
    return this.getXML();
  }

  extractItems(xml) {
    return new Promise((resolve) => {
      this.items = xml.reos.object;
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
      switch (item.transaction_type[0]) {
        case 'Pārdod':
          deals = 'sell';
          break;
        case 'Izīrē/Iznomā':
          deals = 'rent';
          break;
      }

      let category = '';
      // Ids were gotten from DB
      switch (item.type[0]) {
        case 'house':
          category = 'house';
          break;
        case 'apartment':
          category = 'flat';
          break;
        case 'commercial':
          category = 'office';
          break;
      }

      let images = [];
      if (item.pic_url && item.pic_url[0]) {
        images = item.pic_url;
      }

      let data = {
        deal: deals,
        type: category,
        area: item.area_size[0],
        images: images,
        description: item.info[1] ? item.info[1]._ : '' +
        item.info[0] ? item.info[0]._ : '' +
        item.info[2] ? item.info[2]._ : '',
        price: parseFloat(item.price[0]),
        floorsCount: item.floor ? parseInt(item.floor[0]) : undefined,
        totalFloor: item.floors ? parseInt(item.floors[0]) : undefined,
        address: item.street[0],
        rooms: item.rooms ? parseInt(item.rooms[0]) : undefined,
        code: 'ST' + item.object_id[0],
        ownerEmail: item.makler[0].email[0],
        updateDate: Date.now()
      };
      this.ads.push(data);
    } catch (e) {
      logger.error(e);
      // do nothing
    }
  }

  extractUsers(item) {
    try {
      let userContact = item.makler[0].name[0].split(' ');
      let user = {
        email: item.makler[0].email[0],
        name: userContact[0],
        surname: userContact[1],
        company: 'Starlex',
        phone: [item.makler[0].phone[0]],
        updateDate: Date.now()
      };
      this.users[user.email] = user;
    } catch (e) {
      logger.error(e);
      // do nothing
    }
  }

}

module.exports = Starlex;
