module.exports = (sequelize, Sequelize) => {
    const PartidoLocalidad = sequelize.define("partido_localidades", {
        id_partido_localidad: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_partido: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nombre: {
                type: Sequelize.STRING(100),
                     allowNull: false
                },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        capacidad_total: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        capacidad_disponible: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return PartidoLocalidad;
};
