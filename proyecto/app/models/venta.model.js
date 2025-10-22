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
        cliente_nombre: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        cliente_dpi: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        partido: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        localidad: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        precio_unitario: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        total_venta: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        metodo_pago: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        numero_factura: {
            type: Sequelize.STRING(30),
            allowNull: false,
            unique: true
        },
        fecha_venta: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        estado: {
            type: Sequelize.ENUM("pagado", "pendiente", "anulado"),
            defaultValue: "pagado"
        }
    });

    return Venta;
};