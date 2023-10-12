const express = require("express");
require("dotenv").config({ path: "variables.env" });

const routes = require("./routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//CORS permite que un cliente se cconecte a otro servidor para el intercambio de recursos
const cors = require("cors");
// Conectar a la base de datos MongoDB
mongoose.Promise = global.Promise;

// console.log("process.env.DATA_BASE", process.env.DATA_BASE);
mongoose
  //.connect("mongodb://127.0.0.1:27017/restapis", {
  .connect(process.env.DATA_BASE, {
    // .connect("mongodb+srv://cristianvianey:fOx-2825@cluster0.qksr7sc.mongodb.net/Restapis",{
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Conexión exitosa a la base de datos MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

// Crear el servidor
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pedidos-admin.netlify.app",
      "http://localhost:3000/iniciar-sesion",
      "https://pedidos-admin.netlify.app/iniciar-sesion",
    ],
  })
);

console.log("INICIANDO LA APP CORS PERMITIDOS");
//Carpeta pública
// app.use(express.static("uploads")); //ORIGINAL
// Ruta para servir archivos estáticos desde la carpeta "uploads"
// // app.use("/uploads", express.static("uploads")); //ARCHIVOS EN LOCAL
//ARCHIVOS EN AWS
app.get("/uploads/:fileKey", (req, res) => {
  const { fileKey } = req.params;
  const s3BaseUrl = "https://files-aws-cvcl.s3.sa-east-1.amazonaws.com";
  const fileUrl = `${s3BaseUrl}/uploads/${fileKey}`;

  // Redirige al archivo en S3
  res.redirect(fileUrl);
});

//*EXPERIMENTAL
// Configurar cabeceras y cors
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");

//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
//   );

//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

//   next();
// });
//*EXPERIMENTAL

//Habiliar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Definir un dominio(s) para recibir las peticiones
const whitelist = [
  process.env.FRONTEND_URL,
  "https://pedidos-admin.netlify.app",
  "http://localhost:3000",
];
console.log("process.env.FRONTEND_URL?", process.env.FRONTEND_URL);
console.log("process.env.DATA_BASE?", process.env.DATA_BASE);
let repeated = false;

// const corsOption = {
//   origin: (origin, callback) => {
//     if (!repeated) {
//       console.log("origin:", origin);
//       repeated = true;
//     }
//     //Revisar si la petición viene de un servidor que está en whitelist
//     const existe = whitelist.some((dominio) => dominio === origin);
//     if (existe) {
//       callback(null, true);
//     } else {
//       callback(new Error("No permitido por CORS"));
//     }
//   },
// };

// // console.log("whitelist:", whitelist);
// // const corsOption = {
// //   origin: (origin, callback) => {
// //     console.log("origin", origin);
// //     //Revisar si la petición viene de un servidor que esta en whitelist
// //     const existe = whitelist.some((dominio) => dominio === origin);
// //     if (existe) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("No permitido por CORS"));
// //     }
// //   },
// // };

//Habilitar CORS
// app.use(cors(corsOption));

// Rutas de la app
app.use("/", routes());

// Puerto
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

//*Iniciar APP

app.listen(port, host, () => {
  console.log(
    `Servidor escuchando en el puerto ${port} y usando el host: ${host} `
  );
});
