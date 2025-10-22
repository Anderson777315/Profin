const db = require("../models");
const InventarioBoletos = db.inventarioBoletos;
const Op = db.Sequelize.Op;

// Crear un nuevo registro de inventario
exports.create = (req, res) => {
    if (!req.body.nombre_partido || !req.body.nombre_localidad || req.body.cantidad_total == null) {
        res.status(400).send({ message: "Faltan datos obligatorios!" });
        return;
    }

    const inventario = {
        nombre_partido: req.body.nombre_partido,
        nombre_localidad: req.body.nombre_localidad,
        cantidad_total: req.body.cantidad_total,
        cantidad_disponible: req.body.cantidad_disponible || req.body.cantidad_total,
        boletos_vendidos: req.body.boletos_vendidos || 0
    };

    InventarioBoletos.create(inventario)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al crear el registro de inventario." }));
};

// Obtener todos los registros de inventario
exports.findAll = (req, res) => {
    const nombre_partido = req.query.nombre_partido;
    const condition = nombre_partido ? { nombre_partido } : null;

    InventarioBoletos.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener los registros de inventario." }));
};

// Obtener un registro de inventario por ID
exports.findOne = (req, res) => {
    const id_inventario = req.params.id_inventario;

    InventarioBoletos.findByPk(id_inventario)
        .then(data => data ? res.send(data) : res.status(404).send({ message: "Registro de inventario no encontrado" }))
        .catch(err => res.status(500).send({ message: "Error al obtener inventario con id=" + id_inventario }));
};

// Actualizar un registro de inventario por ID
exports.update = (req, res) => {
    const id_inventario = req.params.id_inventario;

    InventarioBoletos.update(req.body, { where: { id_inventario } })
        .then(num => num == 1 ? res.send({ message: "Inventario actualizado correctamente." }) :
            res.send({ message: `No se pudo actualizar el inventario con id=${id_inventario}.` }))
        .catch(err => res.status(500).send({ message: "Error al actualizar inventario con id=" + id_inventario }));
};