module.exports = app => {
    const detalleVenta = require("../controllers/detalleVenta.controller.js");

    var router = require("express").Router();

    router.post("/create", detalleVenta.create);
    router.get("/", detalleVenta.findAll);
    router.get("/search/:id_detalle", detalleVenta.findOne);  
    router.put("/:id_detalle", detalleVenta.update);
    router.get("/precio-actual", detalleVenta.findPrecioActual);
    router.post("/venta-completa", detalleVenta.createVentaCompleta);
   
    app.use('/api/detalleVentas', router);
};