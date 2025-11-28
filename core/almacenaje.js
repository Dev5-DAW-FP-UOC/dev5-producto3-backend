// core/almacenaje.js
import { getDb } from "../database/mongoClient.js";
import { ObjectId } from "mongodb";

// ====== USUARIOS ======

export async function listarUsuarios() {
  const db = getDb();
  const col = db.collection("usuarios");
  return await col.find({}).toArray();
}

export async function altaUsuario(usuario) {
  const db = getDb();
  const col = db.collection("usuarios");

  // comprobar email único
  const existe = await col.findOne({ email: usuario.email });
  if (existe) return null;

  await col.insertOne(usuario);
  return usuario;
}

export async function modificarUsuario(emailOriginal, usuarioActualizado) {
  const db = getDb();
  const col = db.collection("usuarios");

  // si cambia el email, comprobar que no exista ya
  if (usuarioActualizado.email && usuarioActualizado.email !== emailOriginal) {
    const emailExiste = await col.findOne({ email: usuarioActualizado.email });
    if (emailExiste) return null;
  }

  const result = await col.findOneAndUpdate(
    { email: emailOriginal },
    { $set: usuarioActualizado },
    { returnDocument: "after" }
  );

  return result.value; // null si no existe
}

export async function borrarUsuario(email) {
  const db = getDb();
  const col = db.collection("usuarios");
  const result = await col.deleteOne({ email });
  return result.deletedCount === 1;
}

export async function loguearUsuario(email, password) {
  const db = getDb();
  const col = db.collection("usuarios");
  const usuario = await col.findOne({ email, password });
  return usuario || null;
}

// ====== VOLUNTARIADOS ======

export async function listarVoluntariados() {
  const db = getDb();
  const col = db.collection("voluntariados");
  return await col.find({}).toArray();
}

export async function altaVoluntariado(vol) {
  const db = getDb();
  const col = db.collection("voluntariados");

  // Calculamos siguiente id numérico para mantener compatibilidad
  const last = await col.find({}).sort({ id: -1 }).limit(1).toArray();
  const nextId = last[0]?.id ? last[0].id + 1 : 2001;

  const nuevo = { ...vol, id: nextId };
  await col.insertOne(nuevo);

  return nuevo;
}

export async function modificarVoluntariado(id, volActualizado) {
  const db = getDb();
  const col = db.collection("voluntariados");

  const numericId = Number(id);

  // Aseguramos que el id se mantiene
  const datos = { ...volActualizado, id: numericId };

  const result = await col.findOneAndUpdate(
    { id: numericId },
    { $set: datos },
    { returnDocument: "after" }
  );

  return result.value; // null si no existe
}

export async function borrarVoluntariado(id) {
  const db = getDb();
  const col = db.collection("voluntariados");
  const numericId = Number(id);
  const result = await col.deleteOne({ id: numericId });
  return result.deletedCount === 1;
}

// ====== SELECCIONADOS ======

export async function listarSeleccionados() {
  const db = getDb();
  const col = db.collection("seleccionados");
  const docs = await col.find({}).toArray();

  // exponemos seleccionadoId = _id como string
  return docs.map((doc) => ({
    ...doc,
    seleccionadoId: doc._id.toString(),
  }));
}

export async function guardarSeleccionados(vol) {
  const db = getDb();
  const col = db.collection("seleccionados");

  const result = await col.insertOne(vol);

  return {
    ...vol,
    seleccionadoId: result.insertedId.toString(),
  };
}

export async function borrarSeleccionados(id) {
  const db = getDb();
  const col = db.collection("seleccionados");

  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
