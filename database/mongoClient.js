// database/mongoClient.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

// URI y nombre de base de datos
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME || "volunet_prod3";

const client = new MongoClient(uri);
let db;

/**
 * Conecta a MongoDB (solo la primera vez).
 */
export async function connectMongo() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Conectado a MongoDB:", dbName);
  }
  return db;
}

/**
 * Devuelve la instancia de db ya conectada.
 */
export function getDb() {
  if (!db) {
    throw new Error("MongoDB no está conectado. Llama antes a connectMongo().");
  }
  return db;
}
