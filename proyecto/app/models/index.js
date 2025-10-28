const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Conexión con la base de datos Neon
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

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.partido = require("./partido.model.js")(sequelize, Sequelize);
db.localidad = require("./localidades.model.js")(sequelize, Sequelize);
db.inventarioBoletos = require("./inventario.model.js")(sequelize, Sequelize);
db.venta = require("./venta.model.js")(sequelize, Sequelize);
db.detalleVenta = require("./detalleVenta.model.js")(sequelize, Sequelize);
db.partido_localidad = require("./partidolocalidad.model.js")(sequelize, Sequelize);


// Usuario /Ventas
db.usuario.hasMany(db.venta, { foreignKey: 'id_vendedor' });
db.venta.belongsTo(db.usuario, { foreignKey: 'id_vendedor' });

// Venta /DetalleVenta
db.venta.hasMany(db.detalleVenta, { foreignKey: 'id_venta' });
db.detalleVenta.belongsTo(db.venta, { foreignKey: 'id_venta' });

// Partido ↔/Localidad (a través de PartidoLocalidad)
db.partido.hasMany(db.partido_localidad, { foreignKey: 'id_partido' });
db.localidad.hasMany(db.partido_localidad, { foreignKey: 'id_localidad' });

db.partido_localidad.belongsTo(db.partido, { foreignKey: 'id_partido' });
db.partido_localidad.belongsTo(db.localidad, { foreignKey: 'id_localidad' });


module.exports = db;
