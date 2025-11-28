//EXPRESS + GRAPHQL
//EXPRESS: Framework de Node.js para crear APIs web fácilmente.
//GRAPHQL: Un lenguaje de consultas para APIs.

//iniciarlo con node server.js en la capreta de backend
//entrar a la url http://localhost:4000/graphql para ver el panel interactivo de GraphQL

// backend/server.js

// Servidor Express con GraphQL
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema.js";

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // habilita el panel interactivo
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL en http://localhost:${PORT}/graphql`);
});
