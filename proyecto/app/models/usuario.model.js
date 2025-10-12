module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        id_usuario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_usuario: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        contrasena_hash: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        nombre_completo: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        rol: {
            type: Sequelize.ENUM("administrador", "vendedor"),
            allowNull: false
        },
        correo: {
            type: Sequelize.STRING(100),
            unique: true
        },
        telefono: {
            type: Sequelize.STRING(20)
        },
        estado: {
            type: Sequelize.ENUM("activo", "inactivo"),
            defaultValue: "activo"
        },
        ultimo_acceso: {
            type: Sequelize.DATE
        },
        fecha_creacion: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return Usuario;
};