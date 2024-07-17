'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Storm Ave",
        city: "Storm Hill",
        state: "Limgrave",
        country: "Lands Between",
        lat: 37.7749,
        lng: -122.4194,
        name: "Stormveil Castle",
        description: "Big stormy castle.",
        price: 300.00,
      },
      {
        ownerId: 1,
        address: "303 Lake Blvd",
        city: "Liurnia Lake",
        state: "Liurnia",
        country: "Lands Between",
        lat: 47.6062,
        lng: -122.3321,
        name: "Raya Lucaria",
        description: "Academy of magic great for learning the mystic arts.",
        price: 500.00,
      },
      {
        ownerId: 2,
        address: "456 Rotten Ave",
        city: "Caelid South",
        state: "Caelid",
        country: "Lands Between",
        lat: 40.7128,
        lng: -74.0060,
        name: "Redmane Castle",
        description: "Grand castle of Caelid. Very cozy and warm.",
        price: 100.00,
      },
      {
        ownerId: 2,
        address: "404 Shadow Ln",
        city: "Gravesite Plain",
        state: "Shadow Realm",
        country: "Lands Between",
        lat: 30.2672,
        lng: -97.7431,
        name: "Belurat",
        description: "An eclectic home with a unique aesthetic.",
        price: 200.00,
      },
      {
        ownerId: 3,
        address: "789 Mountain Dr",
        city: "Mt. Gelmir Peak",
        state: "Mt. Gelmir",
        country: "Lands Between",
        lat: 41.8781,
        lng: -87.6298,
        name: "Volcano Manor",
        description: "A hot resort with numerous saunas and hot springs.",
        price: 350.00,
      },
      {
        ownerId: 3,
        address: "352 Altus Ave",
        city: "Leyndell",
        state: "Altus Plateau",
        country: "Lands Between",
        lat: 39.7392,
        lng: -104.9903,
        name: "Royal Capital of Leyndell",
        description: "Majestic resort that makes you feel like a king.",
        price: 800.00,
      },
      {
        ownerId: 4,
        address: "758 Golem Blvd",
        city: "Weeping Peninsula",
        state: "Limgrave",
        country: "Lands Between",
        lat: 34.0522,
        lng: -118.2437,
        name: "Castle Morne",
        description: "Cozy castle by the sea. Perfect for a relaxing getaway",
        price: 250.00,
      },
      {
        ownerId: 4,
        address: "606 Haligtree Ln",
        city: "The Haligtree",
        state: "Consecrated Snowfield",
        country: "Lands Between",
        lat: 45.5152,
        lng: -122.6784,
        name: "Elphael",
        description: "Castle facing the sunset.",
        price: 700.00,
      },
      {
        ownerId: 5,
        address: "202 Boreal Rd",
        city: "Boreal Valley",
        state: "Lothric",
        country: "Lothric Kingdom",
        lat: 25.7617,
        lng: -80.1918,
        name: "Irithyll of the Boreal Valley",
        description: "Mystical resort that will fulfill your gothic fantasy",
        price: 800.00,
      },
      {
        ownerId: 5,
        address: "400 God Hills ",
        city: "Lordran City",
        state: "Lordran",
        country: "Kingdom of Lordran",
        lat: 34.0522,
        lng: -118.2437,
        name: "Anor Londo",
        description: "Legendary castle of the Gods",
        price: 950.00,
      },
      {
        ownerId: 6,
        address: "999 Scadu Ln",
        city: "Scadu Altus",
        state: "Shadow Realm",
        country: "Lands Between",
        lat: 34.0094,
        lng: -118.4965,
        name: "Shadow Keep",
        description: "Gothic castle rich in history.",
        price: 350.00,
      },
      {
        ownerId: 6,
        address: "405 Shadow Ln",
        city: "Gravesite Plain",
        state: "Shadow Realm",
        country: "Lands Between",
        lat: 34.0094,
        lng: -118.4965,
        name: "Enir-Ilim",
        description: "Grand castle in the sky.",
        price: 1200.00,      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
