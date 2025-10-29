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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.partido = require("./partido.model.js")(sequelize, Sequelize);
db.localidad = require("./localidades.model.js")(sequelize, Sequelize);
db.partido_localidad = require("./partidolocalidad.model.js")(sequelize, Sequelize);
db.inventarioBoletos = require("./inventario.model.js")(sequelize, Sequelize);
db.venta = require("./venta.model.js")(sequelize, Sequelize);
db.detalleVenta = require("./detalleVenta.model.js")(sequelize, Sequelize);

// RELACIONES SIMPLIFICADAS (sin FKs problemáticas)

// Usuario / Ventas
db.usuario.hasMany(db.venta, { foreignKey: 'id_vendedor' });
db.venta.belongsTo(db.usuario, { foreignKey: 'id_vendedor' });

// Venta / DetalleVenta
db.venta.hasMany(db.detalleVenta, { foreignKey: 'id_venta' });
db.detalleVenta.belongsTo(db.venta, { foreignKey: 'id_venta' });

// Partido / PartidoLocalidad
db.partido.hasMany(db.partido_localidad, { foreignKey: 'id_partido' });
db.partido_localidad.belongsTo(db.partido, { foreignKey: 'id_partido' });

// Localidad / PartidoLocalidad
db.localidad.hasMany(db.partido_localidad, { foreignKey: 'nombre', sourceKey: 'nombre' });
db.partido_localidad.belongsTo(db.localidad, { foreignKey: 'nombre', targetKey: 'nombre' });

// Partido / InventarioBoletos
db.partido.hasMany(db.inventarioBoletos, { foreignKey: 'id_partido' });
db.inventarioBoletos.belongsTo(db.partido, { foreignKey: 'id_partido' });

// InventarioBoletos / Venta
db.inventarioBoletos.hasMany(db.venta, { 
  foreignKey: 'id_inventario',
  sourceKey: 'id_inventario' 
});
db.venta.belongsTo(db.inventarioBoletos, { 
  foreignKey: 'id_inventario',
  targetKey: 'id_inventario' 
});

// NUEVAS RELACIONES AGREGADAS - Localidad / InventarioBoletos
db.localidad.hasMany(db.inventarioBoletos, {
  foreignKey: 'nombre_localidad',
  sourceKey: 'nombre'
});

db.inventarioBoletos.belongsTo(db.localidad, {
  foreignKey: 'nombre_localidad',
  targetKey: 'nombre'
});

// RELACIÓN DETALLEVENTA / LOCALIDAD (para obtener precios)
db.localidad.hasMany(db.detalleVenta, {
  foreignKey: 'nombre_localidad',
  sourceKey: 'nombre'
});

db.detalleVenta.belongsTo(db.localidad, {
  foreignKey: 'nombre_localidad',
  targetKey: 'nombre'
});

// RELACIÓN DETALLEVENTA / INVENTARIO (opcional)
db.inventarioBoletos.hasMany(db.detalleVenta, {
  foreignKey: 'id_inventario'
});

db.detalleVenta.belongsTo(db.inventarioBoletos, {
  foreignKey: 'id_inventario'
});

module.exports = db;