// core/initMongo.js
import { getDb } from "../database/mongoClient.js";
import { datos } from "../database/datos.js";

export async function initDatosEnMongo() {
  const db = getDb();

  const usuariosCol = db.collection("usuarios");
  const voluntariadosCol = db.collection("voluntariados");
  const seleccionadosCol = db.collection("seleccionados");

  // Índices básicos (buenas prácticas)
  await usuariosCol.createIndex({ email: 1 }, { unique: true });
  await voluntariadosCol.createIndex({ id: 1 }, { unique: true });

  // Usuarios
  const numUsuarios = await usuariosCol.countDocuments();
  if (numUsuarios === 0 && Array.isArray(datos.usuarios)) {
    await usuariosCol.insertMany(datos.usuarios);
    console.log("➡️ Usuarios iniciales insertados en MongoDB");
  }

  // Voluntariados
  const numVols = await voluntariadosCol.countDocuments();
  if (numVols === 0 && Array.isArray(datos.voluntariados)) {
    await voluntariadosCol.insertMany(datos.voluntariados);
    console.log("➡️ Voluntariados iniciales insertados en MongoDB");
  }

  // Seleccionados (normalmente vacío al inicio)
  const numSel = await seleccionadosCol.countDocuments();
  if (numSel === 0) {
    console.log("➡️ Colección 'seleccionados' lista (vacía)");
  }
}
