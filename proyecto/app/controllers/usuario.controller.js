const db = require("../models");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");

// Crear un nuevo usuario
exports.create = async (req, res) => {
    if (!req.body.nombre_usuario || !req.body.contrasena || !req.body.nombre_completo || !req.body.rol) {
        return res.status(400).send({ message: "Faltan datos obligatorios!" });
    }

    try {
        // Encriptar la contraseña
        const contrasena_hash = await bcrypt.hash(req.body.contrasena, 10);

        const usuario = {
            nombre_usuario: req.body.nombre_usuario,
            contrasena_hash: contrasena_hash,
            nombre_completo: req.body.nombre_completo,
            rol: req.body.rol,
            correo: req.body.correo || null,
            telefono: req.body.telefono || null,
            estado: req.body.estado || "activo",
            ultimo_acceso: req.body.ultimo_acceso || null,
            fecha_creacion: req.body.fecha_creacion || new Date()
        };

        const data = await Usuario.create(usuario);
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error al crear el usuario." });
    }
};

// Obtener todos los usuarios
exports.findAll = (req, res) => {
    const nombre = req.query.nombre_usuario;
    const condition = nombre ? { nombre_usuario: { [Op.iLike]: `%${nombre}%` } } : null;

    Usuario.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener los usuarios." }));
};

// Obtener un usuario por ID
exports.findOne = (req, res) => {
    const id_usuario = req.params.id_usuario;

    Usuario.findByPk(id_usuario)
        .then(data => data ? res.send(data) : res.status(404).send({ message: "Usuario no encontrado" }))
        .catch(err => res.status(500).send({ message: "Error al obtener usuario con id=" + id_usuario }));
};

// Actualizar un usuario por ID (con hash si se cambia la contraseña)
exports.update = async (req, res) => {
    const id_usuario = req.params.id_usuario;

    try {
        const updateData = { ...req.body };

        // Si viene contrasena en la actualización, convertir a hash
        if (req.body.contrasena) {
            updateData.contrasena_hash = await bcrypt.hash(req.body.contrasena, 10);
            delete updateData.contrasena; // borramos para no guardar el campo sin hash
        }

        const [num] = await Usuario.update(updateData, { where: { id_usuario } });

        if (num === 1) {
            res.send({ message: "Usuario actualizado correctamente." });
        } else {
            res.send({ message: `No se pudo actualizar el usuario con id=${id_usuario}. Quizá no se encontró.` });
        }

    } catch (err) {
        res.status(500).send({ message: err.message || "Error al actualizar usuario" });
    }
};

// Buscar usuarios por nombre completo
exports.findByName = async (req, res) => {
    try {
        const nombre_completo = req.params.nombre_completo;
        if (!nombre_completo) {
            return res.status(400).send({ message: "Falta el parámetro 'nombre_completo' para la búsqueda" });
        }

        const usuarios = await Usuario.findAll({
            where: {
                nombre_completo: { [Op.iLike]: `%${nombre_completo}%` }
            }
        });

        res.send(usuarios);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error al buscar usuarios por nombre completo." });
    }
};

// Buscar usuarios por nombre_usuario
exports.findByUsername = async (req, res) => {
    try {
        const nombre_usuario = req.params.nombre_usuario;
        if (!nombre_usuario) {
            return res.status(400).send({ message: "Falta el nombre de usuario a buscar" });
        }

        const usuarios = await Usuario.findAll({
            where: { nombre_usuario: { [Op.iLike]: `%${nombre_usuario}%` } }
        });

        res.send(usuarios);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error al buscar usuarios" });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
        return res.status(400).send({ message: "Faltan datos de inicio de sesión" });
    }

    try {
        const usuario = await Usuario.findOne({ where: { nombre_usuario } });
        if (!usuario) return res.status(404).send({ message: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena_hash);
        if (!validPassword) return res.status(401).send({ message: "Contraseña incorrecta" });

        res.status(200).send({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol
        });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al iniciar sesión" });
    }
};
