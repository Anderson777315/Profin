module.exports = app => {
    const partidos = require("../controllers/partido.controller.js");
    const router = require("express").Router();

    // Crear un partido
    router.post("/create", partidos.create);

    // Obtener todos los partidos
    router.get("/", partidos.findAll);

    // Buscar partido por nombre de equipo (local o visitante)
    router.get("/buscar/:equipo", partidos.findByEquipo);

    // Obtener partido por ID
    router.get("/:id_partido", partidos.findOne);

    // Actualizar partido
    router.put("/:id_partido", partidos.update);

    app.use('/api/partidos', router);
};
