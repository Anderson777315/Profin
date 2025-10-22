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

db.usuario.hasMany(db.venta, { foreignKey: 'id_vendedor' });
db.venta.belongsTo(db.usuario, { foreignKey: 'id_vendedor' });

// Ventas y DetalleVentas
db.venta.hasMany(db.detalleVenta, { foreignKey: 'id_venta' });
db.detalleVenta.belongsTo(db.venta, { foreignKey: 'id_venta' });
db.usuario.hasMany(db.venta, { foreignKey: 'id_vendedor' });
db.venta.belongsTo(db.usuario, { foreignKey: 'id_vendedor' });
db.venta.hasMany(db.detalleVenta, { foreignKey: 'id_venta' });
db.detalleVenta.belongsTo(db.venta, { foreignKey: 'id_venta' });
module.exports = db;