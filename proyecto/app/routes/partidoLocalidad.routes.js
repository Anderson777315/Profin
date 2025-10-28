module.exports = app => {
    const partidoLocalidad = require("../controllers/partidoLocalidad.controller.js");
    const router = require("express").Router();

    // GET /api/partidos/:idPartido/localidades
    router.get("/partidos/:idPartido/localidades", partidoLocalidad.obtenerLocalidadesPorPartido);

    // POST /api/partidos/localidades
    router.post("/partidos/localidades", partidoLocalidad.asignarLocalidad);

    // DELETE /api/partidos/:idPartido/localidades/:idLocalidad  
    router.delete("/partidos/:idPartido/localidades/:idLocalidad", partidoLocalidad.eliminarLocalidad);

    app.use('/api', router);
};