const db = require("../models");
const Venta = db.venta;           
const DetalleVenta = db.detalleVenta;
const Op = db.Sequelize.Op;

// Crear un nuevo detalle de venta
exports.create = async (req, res) => {
    try {
        // Validar campos obligatorios
        if (!req.body.id_venta || !req.body.id_localidad || !req.body.id_partido || req.body.cantidad == null || req.body.precio_unitario == null)
 {
            return res.status(400).send({ message: "Faltan datos obligatorios!" });
        }

        // Verificar que la venta exista
        const venta = await Venta.findByPk(req.body.id_venta);
        if (!venta) {
            return res.status(400).send({ message: "La venta indicada no existe" });
        }

        // Crear detalle de venta
        const detalleVenta = {
            id_venta: req.body.id_venta,
            id_partido: req.body.id_partido,
            id_localidad: req.body.id_localidad,
            cantidad: Number(req.body.cantidad),
            precio_unitario: Number(req.body.precio_unitario),
            subtotal: Number(req.body.cantidad) * Number(req.body.precio_unitario),
            descuento_aplicado: Number(req.body.descuento_aplicado) || 0.00,
            impuesto: Number(req.body.impuesto) || 0.00
        };

        const data = await DetalleVenta.create(detalleVenta);
        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message || "Error al crear el detalle de venta." });
    }
};

// Obtener todos los detalles de venta
exports.findAll = (req, res) => {
    const id_venta = req.query.id_venta;
    const condition = id_venta ? { id_venta } : null;

    DetalleVenta.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener los detalles de venta." }));
};

// Obtener un detalle de venta por ID
exports.findOne = (req, res) => {
    const id_detalle = req.params.id_detalle;

    DetalleVenta.findByPk(id_detalle)
        .then(data => data ? res.send(data) : res.status(404).send({ message: "Detalle de venta no encontrado" }))
        .catch(err => res.status(500).send({ message: "Error al obtener detalle de venta con id=" + id_detalle }));
};

// Actualizar un detalle de venta por ID
exports.update = (req, res) => {
    const id_detalle = req.params.id_detalle;

    DetalleVenta.update(req.body, { where: { id_detalle } })
        .then(num => num[0] === 1
            ? res.send({ message: "Detalle de venta actualizado correctamente." })
            : res.status(404).send({ message: `No se pudo actualizar el detalle de venta con id=${id_detalle}.` })
        )
        .catch(err => res.status(500).send({ message: "Error al actualizar detalle de venta con id=" + id_detalle }));
};
