const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const productosController = require("../controllers/productosController");
const pedidosController = require("../controllers/pedidosController");
const usuariosController = require("../controllers/usuariosController");

//Middle para proteger las rutas
const auth = require("../middleware/auth");

module.exports = function () {
  // router.get("/", (req, res) => {
  //   res.send("inicio");
  // });
  // router.get("/nosotros", (req, res) => {
  //   res.send("nosotros");
  // });
  //Agrega nuevos clientes via POST
  router.post("/clientes", clienteController.nuevoCliente);
  //Obtener todos los clientes
  router.get("/clientes", clienteController.mostrarClientes);
  //Muestra un cliente en especifico (ID)
  router.get("/clientes/:idCliente", clienteController.mostrarCliente);
  //Actualizar cliente
  router.put("/clientes/:idCliente", clienteController.actualizarCliente);
  //Eliminar cliente
  router.delete("/clientes/:idCliente", clienteController.eliminarCliente);
  //* PRODUCTOS//
  //Nuevos productos
  router.post(
    "/productos",
    productosController.subirArchivo,
    productosController.nuevoProducto
  );
  //Muestra todos los productos
  router.get("/productos", productosController.mostrarProductos);
  //Muestra un producto especifico por su ID
  router.get("/productos/:idProducto", productosController.mostrarProducto);
  //Actualizar Productos
  router.put(
    "/productos/:idProducto",
    productosController.subirArchivo,
    productosController.actualizarProducto
  );
  //Eliminar Productos
  router.delete("/productos/:idProducto", productosController.eliminarProducto);
  //Busqueda de productos
  router.post("/productos/busqueda/:query", productosController.buscarProducto);

  //*PEDIDOS
  //Agregar nuevos pedidos
  router.post("/pedidos/nuevo/:idUsuario", pedidosController.nuevoPedido);
  //Mostrar todos los pedidos
  router.get("/pedidos", pedidosController.mostrarPedidos);
  //Mostrar un pedido por su ID
  router.get("/pedidos/:idPedido", pedidosController.mostrarPedido);
  //Actualizar pedidos
  router.put("/pedidos/:idPedido", pedidosController.actualizarPedido);
  //Eliminar pedidos
  router.delete("/pedidos/:idPedido", pedidosController.eliminarPedido);

  //* USUARIOS
  router.post("/crear-cuenta", usuariosController.registrarUsuario);

  router.post("/iniciar-sesion", usuariosController.autenticarUsuario);
  return router;
};
