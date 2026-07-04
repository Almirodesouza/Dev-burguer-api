'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE(),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE(),
      },
     });
  },

  async down (queryInterface) {
   
     await queryInterface.dropTable('categories');
  }
};
