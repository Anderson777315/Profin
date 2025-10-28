const db = require("../models");
const Partido = db.partido;
const Op = db.Sequelize.Op;

// Crear un nuevo partido
exports.create = async (req, res) => {
    const {
        equipo_local,
        equipo_visitante,
        fecha_partido,
        estadio,
        torneo,
        temporada,
        arbitro_principal,
        estado
    } = req.body;

    if (!equipo_local || !equipo_visitante || !fecha_partido || !estadio) {
        return res.status(400).send({ message: "Faltan datos obligatorios (equipo_local, equipo_visitante, fecha_partido, estadio)." });
    }

    if (equipo_local.trim().toLowerCase() === equipo_visitante.trim().toLowerCase()) {
        return res.status(400).send({ message: "equipo_local y equipo_visitante no pueden ser el mismo." });
    }

    try {
        const partidoExistente = await Partido.findOne({
            where: {
                equipo_local,
                equipo_visitante,
                fecha_partido,
                estadio
            }
        });

        if (partidoExistente) {
            return res.status(400).send({
                message: `Ya existe un partido ${equipo_local} vs ${equipo_visitante} en ${estadio} para la fecha ${fecha_partido}.`
            });
        }

        const partido = {
            equipo_local,
            equipo_visitante,
            fecha_partido,
            estadio,
            torneo: torneo || null,
            temporada: temporada || null,
            arbitro_principal: arbitro_principal || null,
            estado: estado || "programado"
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

    let condition = null;
    if (equipo) {
        condition = {
            [Op.or]: [
                { equipo_local: { [Op.iLike]: `%${equipo}%` } },
                { equipo_visitante: { [Op.iLike]: `%${equipo}%` } }
            ]
        };
    }

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

// Actualizar un partido
exports.update = async (req, res) => {
    const id_partido = req.params.id_partido;

    if (req.body.equipo_local && req.body.equipo_visitante) {
        if (req.body.equipo_local.trim().toLowerCase() === req.body.equipo_visitante.trim().toLowerCase()) {
            return res.status(400).send({ message: "equipo_local y equipo_visitante no pueden ser el mismo." });
        }
    }

    try {
        const [num] = await Partido.update(req.body, { where: { id_partido } });
        if (num === 1) return res.send({ message: "Partido actualizado correctamente." });
        return res.send({ message: `No se pudo actualizar el partido con id=${id_partido}.` });
    } catch (err) {
        res.status(500).send({ message: "Error al actualizar partido con id=" + id_partido });
    }
};

// Buscar partidos por nombre de equipo
exports.findByEquipo = (req, res) => {
    const equipo = req.params.equipo;

    if (!equipo) {
        return res.status(400).send({ message: "Debe ingresar el nombre del equipo" });
    }

    Partido.findAll({
        where: {
            [Op.or]: [
                { equipo_local: { [Op.iLike]: `%${equipo}%` } },
                { equipo_visitante: { [Op.iLike]: `%${equipo}%` } }
            ]
        }
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Error al buscar partidos" }));
};

// Obtener partidos activos
exports.findActivos = (req, res) => {
    Partido.findAll({
        where: {
            estado: {
                [Op.in]: ['programado', 'activo']
            }
        }
    })
    .then(data => {
        const partidosFormateados = data.map(partido => {
            const partidoData = partido.get({ plain: true });
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

// Debug
exports.debugPartidos = (req, res) => {
    Partido.findAll()
    .then(data => {
        const debugInfo = data.map(p => {
            const partidoData = p.get({ plain: true });
            return {
                id_partido: partidoData.id_partido,
                equipo_local: partidoData.equipo_local,
                equipo_visitante: partidoData.equipo_visitante,
                fecha_partido_raw: partidoData.fecha_partido,
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