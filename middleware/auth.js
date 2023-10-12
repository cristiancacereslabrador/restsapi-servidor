const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Autorizacion por el header
  const authHeader = req.get("Authorization");
  // console.log("authHeader1", authHeader);
  if (!authHeader) {
    // console.log("authHeader2", authHeader);
    const error = new Error("No autenticado, no hay JWT");
    error.statusCode = 401;
    throw error;
  }
  //Obtener el token y verificarlo
  const token = authHeader.split(" ")[1];
  let revisarToken;
  try {
    revisarToken = jwt.verify(token, "LLAVESECRETA");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  //Si es un token valido, pero hay algun error
  if (!revisarToken) {
    const error = new Error("No autenticado");
    error.statusCode = 401;
    throw error;
  }
  next();
};
