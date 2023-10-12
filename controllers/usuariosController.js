const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

exports.registrarUsuario = async (req, res, next) => {
  //Leer los datos del usuario

  const usuario = new Usuario(req.body);
  console.log("usuario", usuario);
  console.log("req.body", req.body);
  usuario.password = await bcrypt.hash(req.body.password, 10);
  try {
    await usuario.save();
    res.json({ mensaje: "Usuario Creado Correctamente" });
  } catch (error) {
    console.log("error", error);
    res.json({ mensaje: "Hubo un error" });
  }
};

exports.autenticarUsuario = async (req, res, next) => {
  //Buscar usuario
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });
  console.log("usuario", usuario);
  if (!usuario) {
    //Si el usuario no existe
    await res.status(401).json({ mensaje: "Ese usuario no existe" });
    next();
  } else {
    //Si el usuario existe, verificar si el password es correcto o incorrecto
    if (!bcrypt.compareSync(password, usuario.password)) {
      await res.status(401).json({ mensaje: "Password Incorrecto" });
      next();
    } else {
      //El password correcto, firmar el token
      const token = jwt.sign(
        {
          email: usuario.email,
          usuario: usuario.nombre,
          _id: usuario._id,
        },
        "LLAVESECRETA",
        { expiresIn: "100h" }
      );
      //retornar el TOKEN
      res.json({ token });
      // console.log("el token es: ", token);
    }
  }
};
