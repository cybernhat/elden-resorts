'use strict';

const bcrypt = require("bcryptjs");
const { User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    await User.bulkCreate([
      {
        username: 'TyTyTheWeeWee',
        email: 'tywinlann@hotmail.com',
        firstName: "Tywin",
        lastName: "Lannister",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'motherOdragons',
        email: 'daenerysd@gmail.com',
        firstName: "Daenerys",
        lastName: "Targaryen",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'jonSnow',
        firstName: "Jon",
        lastName: "Snow",
        email: 'jonsnow@gmail.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'BobbyB',
        firstName: "Robert",
        lastName: "Baratheon",
        email: 'kingofwesteros@gmail.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'rogueprince',
        firstName: "Daemon",
        lastName: "Targaryen",
        email: 'daemontheboy@gmail.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'ladysman912',
        firstName: "Tyrion",
        lastName: "Lannister",
        email: 'tillywilly@gmail.com',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ["Demo-lition", "Homey", "Margey", "Barty", "Lisy", "Maggy"] }
    }, {});
  }
};
