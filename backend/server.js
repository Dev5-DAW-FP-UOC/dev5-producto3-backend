// backend/server.js
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema.js";
import { connectDB } from "./db.js";
import { verifyToken } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;

/**
 * Middleware para extraer usuario actual desde JWT
 * @param {Object} req - Request de Express
 * @returns {Object|null} usuarioActual - Payload del token o null
 */
function getUsuarioActual(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    return verifyToken(token);
  } catch (err) {
    console.warn("Token inválido:", err.message);
    return null;
  }
}

// Conectar a MongoDB y levantar servidor
connectDB().then(database => {
  db = database;

  app.use(
    "/graphql",
    graphqlHTTP((req) => ({
      schema,
      graphiql: true,
      context: { db, usuarioActual: getUsuarioActual(req) },
    }))
  );

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Servidor GraphQL en http://localhost:${PORT}/graphql`);
  });
});
