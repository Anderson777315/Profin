module.exports = app => {
    const inventario = require("../controllers/inventario.controller.js");

    var router = require("express").Router();

    router.post("/create", inventario.create);
    router.get("/", inventario.findAll);
    router.get("/:id_inventario", inventario.findOne);
    router.put("/:id_inventario", inventario.update);
  
    app.use('/api/inventario', router);
}
