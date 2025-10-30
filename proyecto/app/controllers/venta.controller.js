const db = require("../models");
const Venta = db.venta;
const DetalleVenta = db.detalleVenta;
const Inventario = db.inventarioBoletos;
const Op = db.Sequelize.Op;

// Función para generar número de factura autoincrementable
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
        const {
            id_vendedor,
            cliente_nombre,
            cliente_dpi,
            partido,
            cantidad,
            localidad,
            precio_unitario,
            total_venta,
            metodo_pago
        } = req.body;

        // Validar campos obligatorios
        if (!id_vendedor || !cliente_nombre || !cliente_dpi || !partido || 
            cantidad == null || !localidad || precio_unitario == null || 
            total_venta == null || !metodo_pago) {
            return res.status(400).send({ message: "Faltan datos obligatorios!" });
        }

        // 1️⃣ Buscar inventario
        const inventario = await Inventario.findOne({
            where: {
                nombre_partido: partido,
                nombre_localidad: localidad
            }
        });

        if (!inventario) {
            return res.status(404).send({ message: "No se encontró inventario para este partido y localidad." });
        }

        // 2️⃣ Validar disponibilidad
        if (inventario.cantidad_disponible < cantidad) {
            return res.status(400).send({ 
                message: `No hay suficientes boletos disponibles. Solo quedan: ${inventario.cantidad_disponible}` 
            });
        }

        // 3️⃣ Generar número de factura
        const numeroFactura = await generarNumeroFactura();

        // 4️⃣ Crear la venta
        const ventaCreada = await Venta.create({
            id_vendedor,
            cliente_nombre,
            cliente_dpi,
            partido,
            cantidad,
            localidad,
            precio_unitario,
            total_venta,
            metodo_pago,
            numero_factura: numeroFactura,
            fecha_venta: new Date(),
            estado: "pagado",
            id_inventario: inventario.id_inventario, // ✅ agregado
            id_partido: inventario.id_partido        // ✅ agregado
        });

        // 5️⃣ Crear detalle de venta
        await DetalleVenta.create({
            id_venta: ventaCreada.id_venta,
            nombre_partido: partido,
            nombre_localidad: localidad,
            cantidad,
            precio_unitario,
            subtotal: cantidad * precio_unitario,
            descuento_aplicado: req.body.descuento_aplicado || 0,
            impuesto: req.body.impuesto || 0
        });

        // 6️⃣ Actualizar inventario
        inventario.boletos_vendidos += cantidad;
        inventario.cantidad_disponible -= cantidad;
        await inventario.save();

        // 7️⃣ Respuesta al cliente
        res.send({
            message: "Venta registrada exitosamente.",
            venta: ventaCreada
        });

    } catch (err) {
        console.error("Error en crear venta:", err);
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
        .then(([num]) => {
            if (num === 1) {
                res.send({ message: "Venta actualizada correctamente." });
            } else {
                res.status(404).send({ message: `No se encontró la venta con id=${id_venta}.` });
            }
        })
        .catch(err => res.status(500).send({ message: "Error al actualizar venta con id=" + id_venta }));
};
