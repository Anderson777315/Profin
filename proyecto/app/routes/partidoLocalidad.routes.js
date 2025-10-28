module.exports = app => {
    const partidoLocalidad = require("../controllers/partidoLocalidad.controller.js");
    const router = require("express").Router();

    // Obtener las localidades de un partido
    router.get("/partido/:id/localidades", partidoLocalidad.obtenerLocalidadesPorPartido);

    // Asignar una localidad a un partido
    router.post("/partido/localidad", partidoLocalidad.asignarLocalidad);

    // Eliminar una localidad de un partido
    router.delete("/partido/:idPartido/localidad/:idLocalidad", partidoLocalidad.eliminarLocalidad);

    app.use('/api', router);
};
