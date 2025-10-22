const db = require("../models");
const Venta = db.venta;
const Op = db.Sequelize.Op;

// Funcion para generar numero de factura autoincrementable
const generarNumeroFactura = async () => {
    try {
        const ultimaVenta = await Venta.findOne({
            order: [['id_venta', 'DESC']]
        });
        
        let siguienteNumero = 1;
        if (ultimaVenta && ultimaVenta.numero_factura) {
            const match = ultimaVenta.numero_factura.match(/FACT-(\d+)/);
            if (match && match[1]) {
                siguienteNumero = parseInt(match[1]) + 1;
            }
        }
        
        return `FACT-${String(siguienteNumero).padStart(6, '0')}`;
    } catch (error) {
        return `FACT-${Date.now()}`;
    }
};

// Crear una nueva venta
exports.create = async (req, res) => {
    try {
        // Validar campos obligatorios (numero_factura removido)
        if (!req.body.id_vendedor || !req.body.cliente_nombre || !req.body.cliente_dpi || !req.body.partido || 
            req.body.cantidad == null || !req.body.localidad || req.body.precio_unitario == null || 
            req.body.total_venta == null || !req.body.metodo_pago) {
            return res.status(400).send({ message: "Faltan datos obligatorios!" });
        }

        // Generar numero de factura automaticamente
        const numeroFactura = await generarNumeroFactura();

        // 1. Primero verificar el inventario
        const inventario = await db.inventarioBoletos.findOne({
            where: {
                nombre_partido: req.body.partido,
                nombre_localidad: req.body.localidad
            }
        });

        if (!inventario) {
            return res.status(400).send({ message: "No se encontró inventario para este partido y localidad" });
        }

        // 2. Verificar si hay suficientes boletos disponibles
        if (inventario.cantidad_disponible < req.body.cantidad) {
            return res.status(400).send({ 
                message: `No hay suficientes boletos disponibles. Solo quedan: ${inventario.cantidad_disponible}` 
            });
        }

        // 3. Crear la venta
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
            numero_factura: numeroFactura,
            fecha_venta: req.body.fecha_venta || new Date(),
            estado: req.body.estado || "pagado"
        };

        const data = await Venta.create(venta);

        // 4. Actualizar el inventario
        await db.inventarioBoletos.update(
            {
                cantidad_disponible: inventario.cantidad_disponible - req.body.cantidad,
                boletos_vendidos: inventario.boletos_vendidos + req.body.cantidad
            },
            {
                where: {
                    nombre_partido: req.body.partido,
                    nombre_localidad: req.body.localidad
                }
            }
        );

        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message || "Error al crear la venta." });
    }
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