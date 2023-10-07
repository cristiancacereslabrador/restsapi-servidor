const Pedidos = require("../models/Pedidos");

exports.nuevoPedido = async (req, res, next) => {
  const pedido = new Pedidos(req.body);
  try {
    await pedido.save();
    res.json({ mensaje: "Se agrego un nuevo pedido" });
  } catch (error) {
    console.log("error", error);
    next();
  }
};
//Muestra todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.find({})
      .populate("cliente")
      .populate({ path: "pedido.producto", model: "Productos" });
    res.json(pedidos);
  } catch (error) {
    console.log("error", error);
    next();
  }
};

//Mostrar un pedido por su ID
exports.mostrarPedido = async (req, res, next) => {
  const pedido = await Pedidos.findById(req.params.idPedido)
    .populate("cliente")
    .populate({ path: "pedido.producto", model: "Productos" });

  if (!pedido) {
    res.json({ mensaje: "Ese pedido no existe" });
    next();
  }
  //Mostrar pedido
  res.json(pedido);
};

//Actualizar el pedido via ID
exports.actualizarPedido = async (req, res, next) => {
  try {
    let pedido = await Pedidos.findOneAndUpdate(
      { _id: req.params.idPedido },
      req.body,
      { new: true }
    )
      .populate("cliente")
      .populate({ path: "pedido.producto", model: "Productos" });
    res.json(pedido);
  } catch (error) {
    console.log("error", error);
    next();
  }
};

//Eliminar Pedido
exports.eliminarPedido = async (req, res, next) => {
  const { idPedido } = req.params;
  try {
    // buscar la ruta de la imagen a eliminar
    const pedido = await Pedidos.findById({ _id: idPedido });

    // if existe la imagen la eliminamos
    if (!pedido) {
      res.json({ mensaje: "El pedido no existe" });
      next();
    } else {
      await Pedidos.findByIdAndDelete({ _id: idPedido });
      res.json({ mensaje: "El pedido se ha eliminado" });
    }
  } catch (error) {
    console.log(error);
    next();
  }
  // // const { idPedido } = req.params.idPedido;
  // // try {
  // //   // buscar la ruta de la imagen a eliminar
  // //   const pedido = await Pedidos.findOneAndDelete({ _id: idPedido });

  // //   // if existe la imagen la eliminamos
  // //   if (!pedido) {
  // //     res.json({ mensaje: "El pedido no existe" });
  // //     next();
  // //   }
  // //   await Pedidos.findOneAndDelete({ _id: idPedido });
  // //   res.json({ mensaje: "El pedido se ha eliminado" });
  // // } catch (error) {
  // //   console.log(error);
  // //   next();
  // // }
};
