module.exports = (sequelize, Sequelize) => {
    const DetalleVenta = sequelize.define("detalle_ventas", {
        id_detalle: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_venta: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_partido: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_localidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        precio_unitario: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        subtotal: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        descuento_aplicado: {
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0.00
        },
        impuesto: {
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0.00
        }
    });

    return DetalleVenta;
};
