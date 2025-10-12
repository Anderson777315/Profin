const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Configuración CORS
var corsOptions = {
  origin: "http://localhost:1889"  // Puerto del frontend
};
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Importamos la base de datos
const db = require("./app/models");

// Sincronizamos los modelos con la base de datos
db.sequelize.sync();
// Si quieres reiniciar tablas: db.sequelize.sync({ force: true }).then(() => console.log("Drop and re-sync db."));

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.json({ message: "Inicialización del sistema de venta de boletos" });
});

// Importamos las rutas
require("./app/routes/usuario.routes")(app);
require("./app/routes/partido.routes")(app);
require("./app/routes/localidad.routes")(app);
require("./app/routes/inventario.routes")(app);
require("./app/routes/venta.routes")(app);
require("./app/routes/detalleVenta.routes")(app);

// Puerto y inicio del servidor
const PORT = process.env.PORT || 1889;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
