module.exports = (sequelize, Sequelize) => {
    const Partido = sequelize.define("partidos", {
        id_partido: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        equipo_local: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        equipo_visitante: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        fecha_partido: {
            type: Sequelize.DATE,
            allowNull: false
        },
        estadio: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        torneo: {
            type: Sequelize.STRING(100)
        },
        temporada: {
            type: Sequelize.STRING(10)
        },
        arbitro_principal: {
            type: Sequelize.STRING(100)
        },
        estado: {
            type: Sequelize.ENUM("programado", "activo", "finalizado"),
            defaultValue: "programado"
        }
    });

    return Partido;
};