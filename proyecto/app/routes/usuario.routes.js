module.exports = app => {
  const usuarios = require("../controllers/usuario.controller.js");

  var router = require("express").Router();

  // Crear usuario
  router.post("/create", usuarios.create);

  // Obtener todos los usuarios
  router.get("/", usuarios.findAll);

  // Obtener usuario por ID
  router.get("/:id_usuario", usuarios.findOne);

  // Actualizar usuario por ID
  router.put("/:id_usuario", usuarios.update);

      // Buscar usuario por nombre completo
      router.get("/buscar1/:nombre_completo", usuarios.findByName);
        // 🔍 Buscar usuario por nombre_usuario
  router.get("/buscar2/:nombre_usuario", usuarios.findByUsername);
  // Login de usuario
router.post("/login", usuarios.login);

  app.use('/api/usuarios', router);

};
