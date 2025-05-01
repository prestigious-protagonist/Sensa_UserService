require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 15,         // Allow more concurrent connections
      min: 0,
      acquire: 30000,  // Wait 30s before throwing timeout
      idle: 10000
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
};
