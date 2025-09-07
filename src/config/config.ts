/* eslint-disable no-process-env */

const config = {
  development: process.env.NODE_ENV === "development",
  production: process.env.NODE_ENV === "production",
  port: process.env.PORT! || 8000,
  database: process.env.DB_URL!,
  databaseName: process.env.DB_NAME || "natours",
};

export default config;
