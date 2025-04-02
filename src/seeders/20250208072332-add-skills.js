'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Skills', [
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

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Skills', null, {});
  }
};
