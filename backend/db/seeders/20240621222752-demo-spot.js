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
        address: "123 Elm St",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        lat: 37.7749,
        lng: -122.4194,
        name: "Cozy Apartment in SF",
        description: "A cozy one-bedroom apartment in the heart of San Francisco.",
        price: 150.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 1,
        address: "303 Birch St",
        city: "Seattle",
        state: "WA",
        country: "USA",
        lat: 47.6062,
        lng: -122.3321,
        name: "Stylish Apartment in Seattle",
        description: "A stylish apartment in downtown Seattle.",
        price: 180.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 2,
        address: "456 Maple Ave",
        city: "New York",
        state: "NY",
        country: "USA",
        lat: 40.7128,
        lng: -74.0060,
        name: "Modern Loft in NYC",
        description: "A modern loft with stunning city views.",
        price: 550.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 2,
        address: "404 Spruce St",
        city: "Austin",
        state: "TX",
        country: "USA",
        lat: 30.2672,
        lng: -97.7431,
        name: "Eclectic Home in Austin",
        description: "An eclectic home with a unique charm.",
        price: 320.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 3,
        address: "789 Oak Dr",
        city: "Chicago",
        state: "IL",
        country: "USA",
        lat: 41.8781,
        lng: -87.6298,
        name: "Charming Bungalow in Chicago",
        description: "A charming bungalow perfect for a weekend getaway.",
        price: 130.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 3,
        address: "505 Aspen Ave",
        city: "Denver",
        state: "CO",
        country: "USA",
        lat: 39.7392,
        lng: -104.9903,
        name: "Mountain Retreat in Denver",
        description: "A cozy retreat near the mountains.",
        price: 200.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 4,
        address: "101 Pine St",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Luxury Condo in LA",
        description: "A luxurious condo with a beautiful city view.",
        price: 300.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 4,
        address: "606 Willow Ln",
        city: "Portland",
        state: "OR",
        country: "USA",
        lat: 45.5152,
        lng: -122.6784,
        name: "Chic Studio in Portland",
        description: "A chic studio apartment in the trendy district.",
        price: 60.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 5,
        address: "202 Cedar St",
        city: "Miami",
        state: "FL",
        country: "USA",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachfront Villa in Miami",
        description: "A luxurious beachfront villa with stunning ocean views.",
        price: 400.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 5,
        address: "606 Ocean Dr",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Luxury Mansion in LA",
        description: "A luxurious mansion with panoramic views of Los Angeles.",
        price: 1200.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 6,
        address: "550 Bluecrest Way",
        city: "Newport Beach",
        state: "CA",
        country: "USA",
        lat: 34.0094,
        lng: -118.4965,
        name: "Cliffhouse in Newport Beach",
        description: "A beautiful cliffhouse overlooing the bay.",
        price: 700.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      },
      {
        ownerId: 6,
        address: "123 Seeder Blvd",
        city: "Union City",
        state: "CA",
        country: "USA",
        lat: 34.0094,
        lng: -118.4965,
        name: "A seeder spot where I live",
        description: "This is a fake spot that you should book.",
        price: 100.00,
        previewImage: "https://images.app.goo.gl/e2Q6ELh75e97dxHU61",
        avgRating: null
      }
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
