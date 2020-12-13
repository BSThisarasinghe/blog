'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     *     */
    await queryInterface.bulkInsert('categories', [{
      title: 'React JS',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'React Native',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Express JS',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * */
    await queryInterface.bulkDelete('People', null, {});

  }
};
