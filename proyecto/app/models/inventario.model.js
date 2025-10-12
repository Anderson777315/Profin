module.exports = (sequelize, Sequelize) => {
    const InventarioBoletos = sequelize.define("inventario_boletos", {
        id_inventario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_partido: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_localidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cantidad_total: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cantidad_disponible: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return InventarioBoletos;
};
