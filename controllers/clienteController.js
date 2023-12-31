const Clientes = require("../models/Clientes");

//Agrega un nuevo cliente
exports.nuevoCliente = async (req, res, next) => {
  // console.log("req.body", req.body);
  const cliente = new Clientes(req.body);
  try {
    await cliente.save();
    res.json({ mensaje: "Se agrego un nuevo cliente" });
  } catch (error) {
    console.log("error", error);
    res.send(error);

    next();
  }
};
//Muestra todos los Clientes
exports.mostrarClientes = async (req, res, next) => {
  try {
    const clientes = await Clientes.find({});
    res.json(clientes);
  } catch (error) {
    console.log("error", error);
    next();
  }
};

//Muestra un cliente por si ID
exports.mostrarCliente = async (req, res, next) => {
  const cliente = await Clientes.findById(req.params.idCliente);
  if (!cliente) {
    res.json({ mensaje: "Este cliente no existe" });
    next();
  }
  //Mostrar el cliente
  res.json(cliente);
};

//Actualiza un cliente por si ID
exports.actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findOneAndUpdate(
      {
        _id: req.params.idCliente,
      },
      req.body,
      { new: true }
    );
    res.json(cliente);
  } catch (error) {
    res.send(error);
    console.log("error", error);
    next();
  }
};

//Elimina un cliente por si ID
exports.eliminarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findOneAndDelete({
      _id: req.params.idCliente,
    });
    res.json({ mensaje: "El cliente ha sido eliminado" });
  } catch (error) {
    console.log("error", error);
    next();
  }
};
