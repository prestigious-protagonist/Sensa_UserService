'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Skills', [
      {
        name: 'Python',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'React',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'NextJS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'C',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'C++',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'C#',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Java',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TypeScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HTML',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'CSS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Git',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Docker',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jenkins',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TailwindCSS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jira',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MySQL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Postgres',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mongo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Redis',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kafka',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Redux',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vite',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'NodeJS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hono',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bun',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Prisma',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rust',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bootstrap',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MaterialUI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shadcn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AceternityUI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ImageKit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Linux',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Go',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'R',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Reset the auto-increment sequence in PostgreSQL
    await queryInterface.sequelize.query('SELECT setval(pg_get_serial_sequence(\'"Skills"\' ,\'id\'), 1, false);');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Skills', null, {});

    // Reset the auto-increment sequence when rolling back
    await queryInterface.sequelize.query('SELECT setval(pg_get_serial_sequence(\'"Skills"\' ,\'id\'), 1, false);');
  }
};
