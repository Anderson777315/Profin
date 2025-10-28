const express = require("express");
const router = express.Router();
const partidoLocalidadController = require("../controllers/partidoLocalidad.controller");

// GET /api/partidos/:idPartido/localidades
router.get("/partidos/:idPartido/localidades", partidoLocalidadController.obtenerLocalidadesPorPartido);

// POST /api/partidos/localidades
router.post("/partidos/localidades", partidoLocalidadController.asignarLocalidad);

// DELETE /api/partidos/:idPartido/localidades/:idLocalidad
router.delete("/partidos/:idPartido/localidades/:idLocalidad", partidoLocalidadController.eliminarLocalidad);

module.exports = router;