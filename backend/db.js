import { MongoClient } from "mongodb";

const uri = "";

const client = new MongoClient(uri);

/**
 * Conecta a MongoDB y devuelve la base de datos
 * @returns {Promise<import("mongodb").Db>} Objeto de base de datos conectado
 */
export async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB conectado correctamente");
    return client.db("volunetDB");
  } catch (error) {
    console.error("Error conectando a MongoDB", error);
  }
}
