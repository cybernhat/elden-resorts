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
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 1,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 5,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 6,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 7,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 7,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 8,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 8,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 9,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 9,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 10,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 10,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 11,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 11,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
      },
      {
        spotId: 12,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: true
      },
      {
        spotId: 12,
        url: "https://images.app.goo.gl/e2Q6ELh75e97dxHU6",
        preview: false
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
