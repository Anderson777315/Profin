const db = require("../models");
const Partido = db.partido;
const Op = db.Sequelize.Op;

// Crear un nuevo partido
exports.create = (req, res) => {
    if (!req.body.equipo_local || !req.body.equipo_visitante || !req.body.fecha_partido || !req.body.estadio) {
        res.status(400).send({ message: "Faltan datos obligatorios!" });
        return;
    }

    const partido = {
       equipo_local: req.body.equipo_local,
            equipo_visitante: req.body.equipo_visitante,
            fecha_partido: req.body.fecha_partido,
            estadio: req.body.estadio,
            torneo: req.body.torneo || null,
            temporada: req.body.temporada || null,
            arbitro_principal: req.body.arbitro_principal || null,
            marcador_local: req.body.marcador_local || 0,
            marcador_visitante: req.body.marcador_visitante || 0,
            estado: req.body.estado || "programado"
    };

    Partido.create(partido)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al crear el partido." }));
};

// Obtener todos los partidos
exports.findAll = (req, res) => {
    const equipo = req.query.equipo_local;
    const condition = equipo ? { equipo_local: { [Op.iLike]: `%${equipo}%` } } : null;

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
// Buscar partidos por nombre de equipo (local o visitante)
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