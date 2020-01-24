'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gifs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      date: {
        allowNull: true,
        type: Sequelize.STRING
      },
      start: {
        allowNull: true,
        type: Sequelize.STRING
      },
      duration: {
        allowNull: true,
        type: Sequelize.STRING
      },
      share: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      video: {
        allowNull: true,
        type: Sequelize.STRING
      },
      gif: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gifs');
  }
};
