module.exports = app => {
    const detalleVenta = require("../controllers/detalleVenta.controller.js");

    var router = require("express").Router();

    router.post("/create", detalleVenta.create);
    router.get("/", detalleVenta.findAll);
    router.get("/:id_detalle", detalleVenta.findOne);
    router.put("/:id_detalle", detalleVenta.update);
   
    app.use('/api/detalleVentas', router);
}
