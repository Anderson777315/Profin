module.exports = (sequelize, Sequelize) => {
    const InventarioBoletos = sequelize.define("inventario_boletos", {
        id_inventario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_partido: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        nombre_localidad: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        cantidad_total: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cantidad_disponible: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        boletos_vendidos: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    return InventarioBoletos;
};
