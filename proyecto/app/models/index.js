const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

// Creamos el objeto db
const db = {};

// Guardamos Sequelize y la instancia
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importamos los modelos
db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.partido = require("./partido.model.js")(sequelize, Sequelize);
db.localidad = require("./localidades.model.js")(sequelize, Sequelize);
db.inventarioBoletos = require("./inventario.model.js")(sequelize, Sequelize);
db.venta = require("./venta.model.js")(sequelize, Sequelize);
db.detalleVenta = require("./detalleVenta.model.js")(sequelize, Sequelize);




/*
// Relaciones
// Usuarios y Ventas
db.usuario.hasMany(db.venta, { foreignKey: 'id_vendedor' });
db.venta.belongsTo(db.usuario, { foreignKey: 'id_vendedor' });
// Partidos e Inventario
db.partido.hasMany(db.inventarioBoletos, { foreignKey: 'id_partido' });
db.inventarioBoletos.belongsTo(db.partido, { foreignKey: 'id_partido' });
// Localidades e Inventario
db.localidad.hasMany(db.inventarioBoletos, { foreignKey: 'id_localidad' });
db.inventarioBoletos.belongsTo(db.localidad, { foreignKey: 'id_localidad' });
// Ventas y DetalleVentas
db.venta.hasMany(db.detalleVenta, { foreignKey: 'id_venta' });
db.detalleVenta.belongsTo(db.venta, { foreignKey: 'id_venta' });
// Partidos y DetalleVentas
db.partido.hasMany(db.detalleVenta, { foreignKey: 'id_partido' });
db.detalleVenta.belongsTo(db.partido, { foreignKey: 'id_partido' });
// Localidades y DetalleVentas
db.localidad.hasMany(db.detalleVenta, { foreignKey: 'id_localidad' });
db.detalleVenta.belongsTo(db.localidad, { foreignKey: 'id_localidad' });
// Exportamos db para poder usarlo en otros archivos
module.exports = db;*/
db.usuario.hasMany(db.venta, { foreignKey: 'id_vendedor' });
db.venta.belongsTo(db.usuario, { foreignKey: 'id_vendedor' });
db.venta.hasMany(db.detalleVenta, { foreignKey: 'id_venta' });
db.detalleVenta.belongsTo(db.venta, { foreignKey: 'id_venta' });
module.exports = db;