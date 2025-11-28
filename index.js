// index.js
import app from "./app.js";
import { connectMongo } from "./database/mongoClient.js";

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // 1. Conectar a MongoDB
    await connectMongo();

    // 2. Arrancar servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error iniciando servidor:", err);
    process.exit(1);
  }
}

startServer();
