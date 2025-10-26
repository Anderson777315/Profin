const db = require("../models");
const Partido = db.partido;
const Op = db.Sequelize.Op;

// Crear un nuevo partido
exports.create = async (req, res) => {
    if (!req.body.equipo || !req.body.tipo_equipo || !req.body.fecha_partido || !req.body.estadio) {
        return res.status(400).send({ message: "Faltan datos obligatorios!" });
    }

    try {
        // VERIFICAR SI YA EXISTE partido con mismo equipo, fecha y estadio
        const partidoExistente = await Partido.findOne({
            where: {
                equipo: req.body.equipo,
                fecha_partido: req.body.fecha_partido,
                estadio: req.body.estadio
            }
        });

        if (partidoExistente) {
            return res.status(400).send({ 
                message: `Ya existe un partido para: ${req.body.equipo} en ${req.body.estadio} en la fecha ${req.body.fecha_partido}` 
            });
        }

        const partido = {
            equipo: req.body.equipo,
            tipo_equipo: req.body.tipo_equipo,
            fecha_partido: req.body.fecha_partido,
            estadio: req.body.estadio,
            torneo: req.body.torneo || null,
            temporada: req.body.temporada || null,
            arbitro_principal: req.body.arbitro_principal || null,
            marcador: req.body.marcador || 0,
            estado: req.body.estado || "programado"
        };

        const data = await Partido.create(partido);
        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message || "Error al crear el partido." });
    }
};

// Obtener todos los partidos
exports.findAll = (req, res) => {
    const equipo = req.query.equipo;
    const condition = equipo ? { equipo: { [Op.iLike]: `%${equipo}%` } } : null;

    Partido.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener los partidos." }));
};

// Obtener un partido por ID
exports.findOne = (req, res) => {
    const id_partido = req.params.id_partido;

    Partido.findByPk(id_partido)
        .then(data => data ? res.send(data) : res.status(404).send({ message: "Partido no encontrado" }))
        .catch(err => res.status(500).send({ message: "Error al obtener partido con id=" + id_partido }));
};

// Actualizar un partido por ID
exports.update = (req, res) => {
    const id_partido = req.params.id_partido;

    Partido.update(req.body, { where: { id_partido } })
        .then(num => num == 1 ? res.send({ message: "Partido actualizado correctamente." }) :
            res.send({ message: `No se pudo actualizar el partido con id=${id_partido}.` }))
        .catch(err => res.status(500).send({ message: "Error al actualizar partido con id=" + id_partido }));
};

// Buscar partidos por nombre de equipo
exports.findByEquipo = (req, res) => {
    const equipo = req.params.equipo;

    if (!equipo) {
        return res.status(400).send({ message: "Debe ingresar el nombre del equipo" });
    }

    Partido.findAll({
        where: {
            equipo: { [Op.iLike]: `%${equipo}%` }
        }
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al buscar partidos" }));
};
// Obtener partidos activos para ventas
exports.findActivos = (req, res) => {
    Partido.findAll({
        where: {
            estado: {
                [Op.in]: ['programado', 'activo']
            }
        }
    })
    .then(data => {
        // Asegurar que las fechas se envíen en formato ISO
        const partidosFormateados = data.map(partido => {
            const partidoData = partido.get({ plain: true });
            // Convertir fecha a ISO string si existe
            if (partidoData.fecha_partido) {
                partidoData.fecha_partido = partidoData.fecha_partido.toISOString();
            }
            return partidoData;
        });
        res.send(partidosFormateados);
    })
    .catch(err => res.status(500).send({ 
        message: err.message || "Error al obtener partidos activos." 
    }));
};

// Endpoint para debugging de partidos
exports.debugPartidos = (req, res) => {
    Partido.findAll()
    .then(data => {
        const debugInfo = data.map(partido => {
            const partidoData = partido.get({ plain: true });
            return {
                id_partido: partidoData.id_partido,
                equipo: partidoData.equipo,
                tipo_equipo: partidoData.tipo_equipo,
                fecha_partido_raw: partidoData.fecha_partido,
                fecha_partido_type: typeof partidoData.fecha_partido,
                fecha_partido_iso: partidoData.fecha_partido ? partidoData.fecha_partido.toISOString() : null,
                estadio: partidoData.estadio,
                estado: partidoData.estado,
                torneo: partidoData.torneo
            };
        });
        res.send(debugInfo);
    })
    .catch(err => res.status(500).send({ 
        message: err.message || "Error en debug." 
    }));
};