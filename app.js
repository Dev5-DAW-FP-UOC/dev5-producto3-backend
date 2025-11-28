// app.js
import express from "express";
// import cors from "cors";

import { graphqlHTTP } from "express-graphql";

import {
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
  login,
} from "./controllers/usuarioController.js";

import {
  getVoluntariados,
  // getVoluntariadosPorUsuario,
  postVoluntariado,
  putVoluntariado,
  deleteVoluntariado,
} from "./controllers/voluntariadoController.js";

import {
  getSeleccionados,
  postSeleccionado,
  deleteSeleccionado,
} from "./controllers/seleccionadoController.js";

import schema from "./graphql/schema.js";
import root from "./graphql/root.js";

const app = express();

app.use(express.json());
// app.use(cors());

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "API Voluntariado funcionando" });
});

//
// ===== RUTAS USUARIOS =====
//
app.get("/api/usuarios", getUsuarios);
app.post("/api/usuarios", postUsuario);
app.put("/api/usuarios/:email", putUsuario);
app.delete("/api/usuarios/:email", deleteUsuario);

app.post("/api/auth/login", login);

//
// ===== RUTAS VOLUNTARIADOS =====
//
app.get("/api/voluntariados", getVoluntariados);
// app.get("/api/voluntariados/usuario/:email", getVoluntariadosPorUsuario);
app.post("/api/voluntariados", postVoluntariado);
app.put("/api/voluntariados/:id", putVoluntariado);
app.delete("/api/voluntariados/:id", deleteVoluntariado);

//
// ===== RUTAS SELECCIONADOS =====
//
app.get("/api/seleccionados", getSeleccionados);
app.post("/api/seleccionados", postSeleccionado);
app.delete("/api/seleccionados/:id", deleteSeleccionado);

// ===== ENDPOINT GRAPHQL =====
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // activa la UI de pruebas
  })
);

export default app;
