module.exports = {
  HOST: "ep-proud-queen-a4i8epij-pooler.us-east-1.aws.neon.tech",
  USER: "neondb_owner",
  PASSWORD: "npg_miYHD2Pa1tuX",
  DB: "neondb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};