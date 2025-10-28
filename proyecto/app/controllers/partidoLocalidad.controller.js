const db = require("../models");
const PartidoLocalidad = db.partido_localidad;
const Localidad = db.localidad;

// Obtener localidades por partido
exports.obtenerLocalidadesPorPartido = async (req, res) => {
    const idPartido = req.params.idPartido;

    try {
        const localidades = await PartidoLocalidad.findAll({
            where: { id_partido: idPartido },
            include: [{ model: Localidad }]
        });

        // Mapear solo la info de Localidad
        const resultado = localidades.map(pl => ({
            id_localidad: pl.localidad.id_localidad,
            nombre: pl.localidad.nombre,
            precio: pl.localidad.precio,
            capacidad_maxima: pl.localidad.capacidad_maxima,
            descripcion: pl.localidad.descripcion,
            estado: pl.localidad.estado
        }));

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener localidades" });
    }
};

// Asignar una localidad a un partido
exports.asignarLocalidad = async (req, res) => {
    const { id_partido, id_localidad } = req.body;

    try {
        const partidoLocalidad = await PartidoLocalidad.create({
            id_partido,
            id_localidad
        });

        res.status(201).json(partidoLocalidad);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al asignar localidad" });
    }
};
