// Importamos las librerías necesarias
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { MongoClient, ObjectId } = require('mongodb'); // [NUEVO] Importamos el driver de MongoDB

// Creamos la aplicación Express
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE MONGODB ---
// URL de conexión. Si usas Atlas, sustituye esto por tu cadena de conexión de Atlas.
// Si usas Docker o local, suele ser: 'mongodb://localhost:27017' o 'mongodb://127.0.0.1:27017'
const MONGO_URI = 'mongodb://127.0.0.1:27017'; 
const DB_NAME = 'volunet_db'; // Nombre de tu base de datos en Mongo

let db; // Variable global para guardar la conexión

// --- CONFIGURACIÓN DE GRAPHQL ---

// 1. Definir el Esquema
// [CAMBIO IMPORTANTE]: El 'id' en MongoDB es un objeto especial (ObjectId).
// Para simplificar, en GraphQL lo trataremos como un 'String'.
const schema = buildSchema(`
  type Usuario {
    id: String
    nombre: String
    email: String
    rol: String
  }

  type Voluntariado {
    id: String
    titulo: String
    tipo: String
    categoria: String
    descripcion: String
    email: String
    fecha: String
  }

  type Query {
    getUsuarios: [Usuario]
    getVoluntariados: [Voluntariado]
    getUsuario(id: String!): Usuario
  }

  type Mutation {
    addUsuario(nombre: String!, email: String!, password: String!, rol: String): Usuario
    deleteUsuario(id: String!): String
    
    addVoluntariado(titulo: String!, tipo: String!, categoria: String!, descripcion: String!, email: String!, fecha: String!): Voluntariado
    deleteVoluntariado(id: String!): String
  }
`);

// 2. Definir los Resolvers (Ahora interactúan con MongoDB)
const root = {
  // --- Consultas (Read) ---
  
  getUsuarios: async () => {
    // db.collection('usuarios').find().toArray() devuelve todos los documentos
    const usuarios = await db.collection('usuarios').find().toArray();
    // Mapeamos _id (objeto de Mongo) a id (string para GraphQL)
    return usuarios.map(u => ({ ...u, id: u._id.toString() }));
  },

  getVoluntariados: async () => {
    const voluntariados = await db.collection('voluntariados').find().toArray();
    return voluntariados.map(v => ({ ...v, id: v._id.toString() }));
  },

  getUsuario: async ({ id }) => {
    const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(id) });
    return usuario ? { ...usuario, id: usuario._id.toString() } : null;
  },

  // --- Mutaciones (Create / Delete) ---
  
  addUsuario: async ({ nombre, email, password, rol }) => {
    const nuevoUsuario = { nombre, email, password, rol: rol || 'user' };
    const resultado = await db.collection('usuarios').insertOne(nuevoUsuario);
    // resultado.insertedId contiene el ID generado por Mongo
    return { ...nuevoUsuario, id: resultado.insertedId.toString() };
  },

  deleteUsuario: async ({ id }) => {
    const resultado = await db.collection('usuarios').deleteOne({ _id: new ObjectId(id) });
    return resultado.deletedCount === 1 ? "Usuario eliminado correctamente" : "Usuario no encontrado";
  },

  addVoluntariado: async ({ titulo, tipo, categoria, descripcion, email, fecha }) => {
    const nuevoVoluntariado = { titulo, tipo, categoria, descripcion, email, fecha };
    const resultado = await db.collection('voluntariados').insertOne(nuevoVoluntariado);
    return { ...nuevoVoluntariado, id: resultado.insertedId.toString() };
  },

  deleteVoluntariado: async ({ id }) => {
    const resultado = await db.collection('voluntariados').deleteOne({ _id: new ObjectId(id) });
    return resultado.deletedCount === 1 ? "Voluntariado eliminado correctamente" : "Voluntariado no encontrado";
  }
};

// 3. Crear el punto de entrada
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// --- ARRANQUE DEL SERVIDOR ---
// Primero conectamos a la BD, y si tiene éxito, arrancamos Express.
async function startServer() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    db = client.db(DB_NAME);
    console.log(`✅ Conectado a MongoDB: ${DB_NAME}`);

    // Solo arrancamos el servidor si la base de datos conecta bien
    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
      console.log(`🎮 Prueba GraphQL en http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
  }
}

startServer();