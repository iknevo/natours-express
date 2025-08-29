/* eslint-disable no-process-env */
const config = {
  development: process.env.NODE_ENV === "development",
  port: process.env.PORT! || 8000,
  database: process.env.DB_URL!,
};
export default config;
