const db = require("../models");
module.exports = app => {
    const localidad = require("../controllers/localidad.controller.js");
    const router = require("express").Router();

    // Crear una nueva Localidad
    router.post("/create", localidad.create);

    // Obtener todas las Localidades
    router.get("/", localidad.findAll);

    // Obtener una sola Localidad por ID
    router.get("/:id_localidad", localidad.findOne);

    // Actualizar una Localidad por ID
    router.put("/:id_localidad", localidad.update);
    
    // Obtener todas las localidades activas
    router.get("/activos", localidad.findAllActive);

    // Buscar localidad por nombre
    router.get("/buscar/:nombre", localidad.findByName);

    router.delete("/:id", localidad.delete);

    // NUEVA RUTA - Localidades con inventario por partido
    router.get("/inventario/:partido", localidad.findWithInventory);

    // ✅ NUEVA RUTA - Corregir nombres en inventario
    router.post("/debug/corregir-nombres-inventario", async (req, res) => {
        try {
            // Corregir "Palco VIP" a "Palco"
            const [resultado] = await db.sequelize.query(`
                UPDATE inventario_boletos 
                SET nombre_localidad = 'Palco' 
                WHERE nombre_localidad = 'Palco VIP'
            `);

            res.send({ 
                message: "Nombres corregidos exitosamente",
                registros_actualizados: resultado,
                detalles: "'Palco VIP' cambiado a 'Palco'"
            });

        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    // AGREGAR ESTA RUTA TEMPORAL PARA DEBUG
    router.get("/debug/estados", async (req, res) => {
        try {
            const localidades = await Localidad.findAll();
            const estados = localidades.map(l => ({
                id: l.id_localidad,
                nombre: l.nombre,
                estado: l.estado
            }));
            res.send(estados);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    app.use('/api/localidades', router);
};