const db = require("../models");
const PartidoLocalidad = db.partido_localidad;
const Localidad = db.localidad;
const Partido = db.partido;

// Obtener localidades por partido
exports.obtenerLocalidadesPorPartido = async (req, res) => {
    const idPartido = req.params.idPartido;

    try {
        // Verificar si el partido existe
        const partido = await Partido.findByPk(idPartido);
        if (!partido) {
            return res.status(404).json({ message: "Partido no encontrado" });
        }

        const partidoLocalidades = await PartidoLocalidad.findAll({
            where: { id_partido: idPartido },
            include: [{
                model: Localidad,
                attributes: ['id_localidad', 'nombre', 'descripcion', 'estado']
            }]
        });

        // Mapear resultado con información de ambas tablas
        const resultado = partidoLocalidades.map(pl => ({
            id_partido_localidad: pl.id,
            id_localidad: pl.localidad.id_localidad,
            nombre: pl.localidad.nombre,
            descripcion: pl.localidad.descripcion,
            estado: pl.localidad.estado,
            precio_partido: pl.precio, // Precio específico para este partido
            capacidad_disponible: pl.capacidad_disponible
        }));

        res.json({
            success: true,
            data: resultado,
            count: resultado.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener localidades del partido",
            error: error.message 
        });
    }
};

// Asignar una localidad a un partido
exports.asignarLocalidad = async (req, res) => {
    const { id_partido, id_localidad, precio, capacidad_disponible } = req.body;

    try {
        // Validaciones
        if (!id_partido || !id_localidad) {
            return res.status(400).json({ 
                success: false,
                message: "id_partido e id_localidad son requeridos" 
            });
        }

        // Verificar si ya existe la relación
        const existeRelacion = await PartidoLocalidad.findOne({
            where: { id_partido, id_localidad }
        });

        if (existeRelacion) {
            return res.status(409).json({ 
                success: false,
                message: "Esta localidad ya está asignada al partido" 
            });
        }

        const partidoLocalidad = await PartidoLocalidad.create({
            id_partido,
            id_localidad,
            precio: precio || 0.00,
            capacidad_disponible: capacidad_disponible || 0
        });

        res.status(201).json({
            success: true,
            message: "Localidad asignada al partido exitosamente",
            data: partidoLocalidad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Error al asignar localidad al partido",
            error: error.message 
        });
    }
};

// Eliminar localidad de un partido
exports.eliminarLocalidad = async (req, res) => {
    const { idPartido, idLocalidad } = req.params;

    try {
        const resultado = await PartidoLocalidad.destroy({
            where: { id_partido: idPartido, id_localidad: idLocalidad }
        });

        if (resultado === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Relación partido-localidad no encontrada" 
            });
        }

        res.json({
            success: true,
            message: "Localidad eliminada del partido exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Error al eliminar localidad del partido",
            error: error.message 
        });
    }
};