const db = require("../models");
const Venta = db.venta;
const Op = db.Sequelize.Op;

// Crear una nueva venta
exports.create = (req, res) => {
    if (!req.body.id_vendedor || !req.body.cliente_nombre || !req.body.cliente_dpi || !req.body.partido || 
        req.body.cantidad == null || !req.body.localidad || req.body.precio_unitario == null || 
        req.body.total_venta == null || !req.body.metodo_pago || !req.body.numero_factura) {
        res.status(400).send({ message: "Faltan datos obligatorios!" });
        return;
    }

    const venta = {
        id_vendedor: req.body.id_vendedor,
        cliente_nombre: req.body.cliente_nombre,
        cliente_dpi: req.body.cliente_dpi,
        partido: req.body.partido,
        cantidad: req.body.cantidad,
        localidad: req.body.localidad,
        precio_unitario: req.body.precio_unitario,
        total_venta: req.body.total_venta,
        metodo_pago: req.body.metodo_pago,
        numero_factura: req.body.numero_factura,
        fecha_venta: req.body.fecha_venta || new Date(),
        estado: req.body.estado || "pagado"
    };

    Venta.create(venta)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al crear la venta." }));
};

// Obtener todas las ventas
exports.findAll = (req, res) => {
    const id_vendedor = req.query.id_vendedor;
    const condition = id_vendedor ? { id_vendedor } : null;

    Venta.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener las ventas." }));
};

// Obtener una venta por ID
exports.findOne = (req, res) => {
    const id_venta = req.params.id_venta;

    Venta.findByPk(id_venta)
        .then(data => data ? res.send(data) : res.status(404).send({ message: "Venta no encontrada" }))
        .catch(err => res.status(500).send({ message: "Error al obtener venta con id=" + id_venta }));
};

// Actualizar una venta por ID
exports.update = (req, res) => {
    const id_venta = req.params.id_venta;

    Venta.update(req.body, { where: { id_venta } })
        .then(num => num == 1 ? res.send({ message: "Venta actualizada correctamente." }) :
            res.send({ message: `No se pudo actualizar la venta con id=${id_venta}.` }))
        .catch(err => res.status(500).send({ message: "Error al actualizar venta con id=" + id_venta }));
};