'use strict';

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://old.gamebyte.com/wp-content/uploads/2022/02/263270cd-elden-ring-stormveil-castle.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/05/elden-ring-strange-encounter-raya-lucaria-academy.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/castle-redmane.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://pbs.twimg.com/media/GR-b3HibgAAOaB6?format=jpg&name=4096x4096",
        preview: true
      },
      {
        spotId: 5,
        url: "https://tecmasters.com.br/wp-content/webp-express/webp-images/uploads/2022/03/IMG_1055-1-1024x576.jpg.webp",
        preview: true
      },
      {
        spotId: 6,
        url: "https://pbs.twimg.com/media/FntiU8nXEAAt5Wq.jpg",
        preview: true
      },
      {
        spotId: 7,
        url: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/elden-ring/d/d7/Morne_IG_Loc.jpg",
        preview: true
      },
      {
        spotId: 8,
        url: "https://cdn.vox-cdn.com/thumbor/V1QqfcqLXQOWtQuMSEjBjNqkOks=/0x0:3840x2160/1200x800/filters:focal(1613x773:2227x1387)/cdn.vox-cdn.com/uploads/chorus_image/image/70909168/elden_ring_elphael_hero_2.0.jpg",
        preview: true
      },
      {
        spotId: 9,
        url: "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2020/06/Dark-Souls-3-Anor-Londo-Cropped.jpg",
        preview: true
      },
      {
        spotId: 10,
        url: "https://steamuserimages-a.akamaihd.net/ugc/847091252324318595/094486702D79909DA5FEF2B4C0E1A9FEDDE214E8/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false8",
        preview: true
      },
      {
        spotId: 11,
        url: "https://cdn.vox-cdn.com/thumbor/VhiGCXmUtpHSmK8KV1-JIlAIvOw=/0x0:1920x1080/1200x800/filters:focal(807x387:1113x693)/cdn.vox-cdn.com/uploads/chorus_image/image/73418929/Elden_Ring_SotE_Shadow_Keep.0.png",
        preview: true
      },
      {
        spotId: 12,
        url: "https://i.namu.wiki/i/fso5NfqLQrx-AyTPTr5VbgWXeo4IifGjQhIkKoXuurW_7PrJ8N2YIwzIgRh01YqVj5QzXluMJitil64AFhDwFg.webp",
        preview: true
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
    }, {});
  }
};
