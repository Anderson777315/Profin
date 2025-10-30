const db = require("../models");
const Venta = db.venta;           
const DetalleVenta = db.detalleVenta;
const Inventario = db.inventarioBoletos;
const Op = db.Sequelize.Op;

// Crear un nuevo detalle de venta
exports.create = async (req, res) => {
    try {
        // Validar campos obligatorios
        if (!req.body.id_venta || !req.body.nombre_localidad || !req.body.nombre_partido || req.body.cantidad == null || req.body.precio_unitario == null) {
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
            nombre_partido: req.body.nombre_partido,
            nombre_localidad: req.body.nombre_localidad,
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
exports.findAll = async (req, res) => {
  try {
    const id_venta = req.query.id_venta;
    const condition = id_venta ? { id_venta } : undefined;

    const data = await DetalleVenta
      .unscoped()
      .findAll({
        where: condition,
        attributes: [
          'id_detalle','id_venta','nombre_partido','nombre_localidad',
          'cantidad','precio_unitario','subtotal','descuento_aplicado','impuesto'
        ]
      });

    res.send(data);
  } catch (err) {
    console.error('findAll DetalleVenta error:', err);
    res.status(500).send({ message: err.message || 'Error al obtener los detalles de venta.' });
  }
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

// Obtener precio unitario actual por partido y localidad
exports.findPrecioActual = async (req, res) => {
    try {
        const { partido, localidad } = req.query;

        if (!partido || !localidad) {
            return res.status(400).send({ 
                message: "Se requieren los parámetros: partido y localidad" 
            });
        }

        const ultimoPrecio = await DetalleVenta.findOne({
            where: {
                nombre_partido: partido,
                nombre_localidad: localidad
            },
            order: [['id_detalle', 'DESC']],
            attributes: ['precio_unitario']
        });

        if (ultimoPrecio) {
            res.send(ultimoPrecio.precio_unitario.toString());
        } else {
            const inventario = await Inventario.findOne({
                where: {
                    nombre_partido: partido,
                    nombre_localidad: localidad
                }
            });
            
            const precioDefault = inventario && inventario.precio_unitario ? 
                inventario.precio_unitario : 100.00;
            res.send(precioDefault.toString());
        }

    } catch (err) {
        console.error("Error al obtener precio actual:", err);
        res.status(500).send({ message: "Error al obtener el precio unitario." });
    }
};

// Crear venta completa con múltiples detalles
exports.createVentaCompleta = async (req, res) => {
    const t = await db.sequelize.transaction();
    
    try {
        const { venta, detalles } = req.body;

        if (!venta || !detalles || !Array.isArray(detalles)) {
            await t.rollback();
            return res.status(400).send({ 
                message: "Estructura de datos inválida. Se requieren 'venta' y 'detalles'" 
            });
        }

        const generarNumeroFactura = async () => {
            const ultimaVenta = await Venta.findOne({
                order: [['id_venta', 'DESC']],
                transaction: t
            });

            let siguienteNumero = 1;
            if (ultimaVenta && ultimaVenta.numero_factura) {
                const match = ultimaVenta.numero_factura.match(/FACT-(\d+)/);
                if (match && match[1]) {
                    siguienteNumero = parseInt(match[1]) + 1;
                }
            }
            return `FACT-${String(siguienteNumero).padStart(6, '0')}`;
        };

        const numeroFactura = await generarNumeroFactura();

        const totalVenta = detalles.reduce((sum, detalle) => 
            sum + (detalle.cantidad * detalle.precio_unitario), 0);

        const ventaCreada = await Venta.create({
            ...venta,
            numero_factura: numeroFactura,
            fecha_venta: new Date(),
            estado: "pagado",
            total_venta: totalVenta,
            cantidad: detalles.reduce((sum, det) => sum + det.cantidad, 0),
            localidad: detalles.length === 1 ? detalles[0].nombre_localidad : "Múltiple",
            precio_unitario: totalVenta / detalles.reduce((sum, det) => sum + det.cantidad, 0)
        }, { transaction: t });

        for (const detalle of detalles) {
            const inventario = await Inventario.findOne({
                where: {
                    nombre_partido: detalle.nombre_partido,
                    nombre_localidad: detalle.nombre_localidad
                },
                transaction: t
            });

            if (!inventario) {
                await t.rollback();
                return res.status(404).send({ 
                    message: `No se encontró inventario para: ${detalle.nombre_partido} - ${detalle.nombre_localidad}` 
                });
            }

            if (inventario.cantidad_disponible < detalle.cantidad) {
                await t.rollback();
                return res.status(400).send({ 
                    message: `No hay suficientes boletos para ${detalle.nombre_localidad}. Disponible: ${inventario.cantidad_disponible}` 
                });
            }

            await DetalleVenta.create({
                id_venta: ventaCreada.id_venta,
                nombre_partido: detalle.nombre_partido,
                nombre_localidad: detalle.nombre_localidad,
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                subtotal: detalle.cantidad * detalle.precio_unitario,
                descuento_aplicado: detalle.descuento_aplicado || 0,
                impuesto: detalle.impuesto || 0
            }, { transaction: t });

            inventario.cantidad_disponible -= detalle.cantidad;
            inventario.boletos_vendidos = (inventario.boletos_vendidos || 0) + detalle.cantidad;
            await inventario.save({ transaction: t });
        }

        await t.commit();

        res.send({
            message: "Venta completa registrada exitosamente",
            venta: ventaCreada,
            total_detalles: detalles.length,
            total: totalVenta
        });

    } catch (err) {
        await t.rollback();
        console.error("Error en createVentaCompleta:", err);
        res.status(500).send({ 
            message: err.message || "Error al crear la venta completa." 
        });
    }
};