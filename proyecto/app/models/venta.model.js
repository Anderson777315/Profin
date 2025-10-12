module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("ventas", {
        id_venta: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fecha_venta: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        metodo_pago: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        total_venta: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        numero_factura: {
            type: Sequelize.STRING(30)
        },
        estado: {
            type: Sequelize.ENUM("pagado", "pendiente", "anulado"),
            defaultValue: "pagado"
        },
        cliente_nombre: {
            type: Sequelize.STRING(100)
        },
        cliente_dpi: {
            type: Sequelize.STRING(20)
        }
    });

    return Venta;
};
