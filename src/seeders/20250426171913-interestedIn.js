'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('InterestedIns', [
      {
        "name": "Full-Stack Web Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Frontend Development / UI Design",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Backend API Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "DevOps & Automation",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Machine Learning / AI",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Data Science & Analytics",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "State Management in Web Apps",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Package Management & Runtimes",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Modern Hosting & Deployment",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Static Site Generation & SEO",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Databases – SQL",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Databases – NoSQL",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Event-Driven Architecture",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Object-Relational Mapping (ORM)",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "CDN & Media Optimization",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Operating Systems & Scripting",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Game Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Authentication & Realtime Backend",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Version Control & Collaboration",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Agile Project Management",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "LLM Application Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "LLM Data Indexing / RAG",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Static Web Structure",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Server-side Development with Performance Focus",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Systems Programming",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "High-Performance Computing",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Mobile & Android Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Enterprise Software Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Embedded Systems / Low-Level Dev",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Statistical Computing",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Microservices & Real-time Systems",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Middleware & Lightweight Frameworks",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Typed JavaScript Development",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Component-based Web Architecture",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "UI/UX Prototyping & Theming",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Learning & Experimentation Platforms",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('InterestedIns', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE "InterestedIns_id_seq" RESTART WITH 1');
  }
};
