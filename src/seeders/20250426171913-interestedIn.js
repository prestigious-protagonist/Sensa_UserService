'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('InterestedIns', [
      {
        name: 'JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Python',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SQL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'React',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
   
  }
};
