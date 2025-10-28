const db = require("../models");
const PartidoLocalidad = db.partido_localidad;
const Localidad = db.localidad;
const Partido = db.partido;

// Obtener localidades por partido
exports.obtenerLocalidadesPorPartido = async (req, res) => {
    const idPartido = req.params.id;

    try {
        // Verificar si el partido existe
        const partido = await Partido.findByPk(idPartido);
        if (!partido) {
            return res.status(404).json({ message: "Partido no encontrado" });
        }

        // Obtener todas las localidades asociadas a ese partido
        const partidoLocalidades = await PartidoLocalidad.findAll({
            where: { id_partido: idPartido },
            include: [{
                model: Localidad,
                as: 'localidade',  
                attributes: ['id_localidad', 'nombre', 'descripcion', 'estado']
            }]
        });

        // Mapear el resultado para incluir datos combinados
        const resultado = partidoLocalidades.map(pl => ({
            id_partido_localidad: pl.id_partido_localidad,
            id_localidad: pl.id_localidad,
            id_partido: pl.id_partido,
            nombre: pl.localidade ? pl.localidade.nombre : null,  // ← CAMBIAR aquí también
            descripcion: pl.localidade ? pl.localidade.descripcion : null,  // ← Y aquí
            estado: pl.localidade ? pl.localidade.estado : null,  // ← Y aquí
            precio_partido: pl.precio,
            capacidad_total: pl.capacidad_total,
            capacidad_disponible: pl.capacidad_disponible,
            boletos_vendidos: pl.boletos_vendidos
        }));

        res.json({
            success: true,
            data: resultado,
            count: resultado.length
        });
    } catch (error) {
        console.error("Error en obtenerLocalidadesPorPartido:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener localidades del partido",
            error: error.message
        });
    }
};

// Asignar una localidad a un partido
exports.asignarLocalidad = async (req, res) => {
    const { id_partido, id_localidad, precio, capacidad_total } = req.body;

    try {
        // Validar campos obligatorios
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
                message: "Esta localidad ya está asignada a este partido"
            });
        }

        // Crear la relación
        const partidoLocalidad = await PartidoLocalidad.create({
            id_partido,
            id_localidad,
            precio: precio || 0.00,
            capacidad_total: capacidad_total || 0,
            capacidad_disponible: capacidad_total || 0,
            boletos_vendidos: 0
        });

        res.status(201).json({
            success: true,
            message: "Localidad asignada al partido exitosamente",
            data: partidoLocalidad
        });
    } catch (error) {
        console.error("Error en asignarLocalidad:", error);
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
        console.error("Error en eliminarLocalidad:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar localidad del partido",
            error: error.message
        });
    }
};