module.exports = (sequelize, Sequelize) => {
                        const PartidoLocalidad = sequelize.define("partido_localidad", {
                       id_partidolocalidad: {
              type: Sequelize.INTEGER,
                      autoIncrement: true,
                 primaryKey: true,
                 field: 'id_partidolocalidad'
        },
        id_partido: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "partidos",
                key: "id_partido"
            }
        },
        id_localidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "localidades",
                key: "id_localidad"
            }
        },
        precio: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00
        },
        capacidad_disponible: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'partido_localidad',
        indexes: [
            {
                unique: true,
                fields: ['id_partido', 'id_localidad']
            }
        ]
    });

    return PartidoLocalidad;
};