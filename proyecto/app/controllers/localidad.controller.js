const db = require("../models");
const Localidad = db.localidad;
const Op = db.Sequelize.Op;

// Crear una nueva localidad
exports.create = async (req, res) => {
    if (!req.body.nombre || !req.body.precio) {
        return res.status(400).send({ message: "Faltan datos obligatorios!" });
    }

    try {
        // VERIFICAR SI YA EXISTE localidad con mismo nombre
        const localidadExistente = await Localidad.findOne({
            where: { nombre: req.body.nombre }
        });

        if (localidadExistente) {
            return res.status(400).send({ 
                message: `Ya existe una localidad con el nombre: ${req.body.nombre}` 
            });
        }

        const localidad = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            capacidad_maxima: req.body.capacidad_maxima,
            descripcion: req.body.descripcion || null,
            estado: req.body.estado || "Disponible"
        };

        const data = await Localidad.create(localidad);
        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message || "Error al crear la localidad." });
    }
};

// Obtener todas las localidades
exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    const condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Localidad.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener las localidades." }));
};

// Obtener una localidad por ID
exports.findOne = (req, res) => {
    const id_localidad = req.params.id_localidad;

    Localidad.findByPk(id_localidad)
        .then(data => data ? res.send(data) : res.status(404).send({ message: "Localidad no encontrada" }))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener la localidad." }));
};

// Actualizar una localidad por ID
exports.update = (req, res) => {
    const id_localidad = req.params.id_localidad;

    Localidad.update(req.body, { where: { id_localidad: id_localidad } })
        .then(num => {
            if (num[0] === 1) {
                res.send({ message: "Localidad actualizada correctamente." });
            } else {
                res.status(404).send({ message: "No se encontró la localidad o no hubo cambios." });
            }
        })
        .catch(err => res.status(500).send({ message: err.message || "Error al actualizar la localidad." }));
};

// Buscar localidad por nombre
exports.findByName = (req, res) => {
    const nombre = req.params.nombre;

    if (!nombre) {
        return res.status(400).send({ message: "Debe ingresar el nombre de la localidad" });
    }

    Localidad.findAll({
        where: { nombre: { [Op.iLike]: `%${nombre}%` } }
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al buscar localidad por nombre" }));
};
// Obtener todas las localidades activas
exports.findAllActive = (req, res) => {
    Localidad.findAll({ 
        where: { 
            estado: {
                [Op.or]: ["Disponible", "disponible", "Activo", "activo", "ACTIVO", "DISPONIBLE"]
            }
        } 
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al obtener las localidades activas." }));
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await db.localidad.destroy({
            where: { id_localidad: id }
        });

        if (deleted) {
            res.status(200).send({ message: "Localidad eliminada correctamente." });
        } else {
            res.status(404).send({ message: "Localidad no encontrada." });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error al eliminar la localidad: " + err.message
        });
    }
};
// Obtener localidades con inventario por partido
exports.findWithInventory = async (req, res) => {
    try {
        const nombrePartido = req.params.partido;
        
        const localidadesConInventario = await db.sequelize.query(`
            SELECT 
                l.id_localidad,
                l.nombre,
                l.precio,
                l.capacidad_maxima,
                COALESCE(ib.cantidad_disponible, l.capacidad_maxima) as cantidad_disponible,
                ib.nombre_partido,
                ib.id_inventario,
                l.estado
            FROM localidades l
            LEFT JOIN inventario_boletos ib ON l.nombre = ib.nombre_localidad 
                AND ib.nombre_partido = :nombrePartido
            WHERE l.estado = 'Disponible'
        `, {
            replacements: { nombrePartido: nombrePartido },
            type: db.sequelize.QueryTypes.SELECT
        });

        res.send(localidadesConInventario);

    } catch (err) {
        res.status(500).send({ 
            message: err.message || "Error al obtener localidades con inventario." 
        });
    }
};