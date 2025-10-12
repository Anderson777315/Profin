module.exports = (sequelize, Sequelize) => {
    const Localidad = sequelize.define("localidades", {
        id_localidad: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        capacidad_maxima: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING(255)
        },
        estado: {
            type: Sequelize.ENUM("activo", "inactivo"),
            defaultValue: "activo"
        }
    });

    return Localidad;
};
