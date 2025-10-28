module.exports = (sequelize, Sequelize) => {
    const PartidoLocalidad = sequelize.define("partido_localidad", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_partido: {
            type: Sequelize.INTEGER,
            references: {
                model: "partidos",
                key: "id_partido"
            }
        },
        id_localidad: {
            type: Sequelize.INTEGER,
            references: {
                model: "localidades",
                key: "id_localidad"
            }
        },
        // Opcional: capacidad o precio específico por partido
        precio: {
            type: Sequelize.DECIMAL(10,2)
        },
        capacidad_disponible: {
            type: Sequelize.INTEGER
        }
    });

    return PartidoLocalidad;
};
