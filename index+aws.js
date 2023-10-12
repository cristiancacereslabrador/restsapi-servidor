const express = require("express");
require("dotenv").config({ path: "variables.env" });
const routes = require("./routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3"); // Import AWS SDK v3

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://cristianvianey:fOx-2825@cluster0.qksr7sc.mongodb.net/Restapis",
    {
      // .connect(process.env.DATA_BASE, {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Conexión exitosa a la base de datos MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

const app = express();

// Configure AWS SDK v3 with your credentials and region
const s3Client = new S3Client({
  region: "sa-east-1", // Change to your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

console.log("INICIANDO LA APP CON CORS PERMITIDOS");

// Route to serve static files from Amazon S3
app.get("/uploads/:fileKey", async (req, res) => {
  const { fileKey } = req.params;

  // Configure the parameters for the GetObjectCommand
  const getObjectParams = {
    Bucket: "files-aws-cvcl", // Replace with your S3 bucket name
    Key: `uploads/${fileKey}`,
  };

  try {
    // Use AWS SDK v3 to get the object from S3
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

    // Pipe the object data to the response
    Body.pipe(res);
  } catch (error) {
    console.error("Error retrieving object from S3:", error);
    return res.status(500).send("Error retrieving file from S3");
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(
    `Servidor escuchando en el puerto ${port} y usando el host: ${host} `
  );
});
