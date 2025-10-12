module.exports = app => {
    const ventas = require("../controllers/venta.controller.js");

    var router = require("express").Router();

    router.post("/create", ventas.create);
    router.get("/", ventas.findAll);
    router.get("/:id_venta", ventas.findOne);
    router.put("/:id_venta", ventas.update);


    app.use('/api/ventas', router);
}
