module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("ventas", {
        id_venta: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id_usuario'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        cliente_nombre: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        cliente_dpi: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        id_inventario: {  // Cambiado por la clave primaria real
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'inventario_boletos',
                key: 'id_inventario'  // Referencia a la PK real
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        id_partido: {  // Mantenemos id_partido pero sin FK
            type: Sequelize.INTEGER,
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
            type: Sequelize.ENUM("Tarjeta", "pendiente"),
            defaultValue: "Tarejeta"
        }
    });

    return Venta;
};