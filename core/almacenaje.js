// core/almacenaje.js
import { randomUUID } from "node:crypto";
import { datos } from "../database/datos.js";

// ======== ESTADO EN MEMORIA A PARTIR DE datos.js ======== //

const usuarios = Array.isArray(datos.usuarios) ? [...datos.usuarios] : [];

let voluntariados = Array.isArray(datos.voluntariados)
  ? [...datos.voluntariados]
  : [];

let seleccionados = [];

// Calculamos el siguiente id numérico para voluntariados
let nextVolId =
  voluntariados.length > 0
    ? Math.max(...voluntariados.map((v) => Number(v.id) || 0)) + 1
    : 1;

// ======== USUARIOS ======== //

export function altaUsuario(usuario) {
  const existe = usuarios.some((u) => u.email === usuario.email);
  if (existe) return null;

  const nuevo = { ...usuario }; // usamos email como clave única
  usuarios.push(nuevo);
  return nuevo;
}

export function listarUsuarios() {
  return usuarios;
}

export function modificarUsuario(emailOriginal, usuarioActualizado) {
  const idx = usuarios.findIndex((u) => u.email === emailOriginal);
  if (idx === -1) return null;

  // si cambia el email, comprobar que no exista en otro usuario
  if (usuarioActualizado.email !== emailOriginal) {
    const existeNuevo = usuarios.some(
      (u) => u.email === usuarioActualizado.email && u.email !== emailOriginal
    );
    if (existeNuevo) return null;
  }

  const actualizado = {
    ...usuarios[idx],
    ...usuarioActualizado,
  };

  usuarios[idx] = actualizado;
  return actualizado;
}

export function borrarUsuario(email) {
  const idx = usuarios.findIndex((u) => u.email === email);
  if (idx === -1) return false;
  usuarios.splice(idx, 1);
  return true;
}

export function loguearUsuario(email, password) {
  const usuario = usuarios.find(
    (u) => u.email === email && u.password === password
  );
  return usuario || null;
}

// ======== VOLUNTARIADOS ======== //

export function altaVoluntariado(voluntariado) {
  const nuevo = {
    ...voluntariado,
    id: nextVolId++,
  };
  voluntariados.push(nuevo);
  return nuevo;
}

export function listarVoluntariados() {
  return voluntariados;
}

export function modificarVoluntariado(id, voluntariadoActualizado) {
  const numId = Number(id);
  const idx = voluntariados.findIndex((v) => Number(v.id) === numId);
  if (idx === -1) return null;

  const actualizado = {
    ...voluntariados[idx],
    ...voluntariadoActualizado,
    id: voluntariados[idx].id, // mantenemos el id original
  };

  voluntariados[idx] = actualizado;
  return actualizado;
}

export function borrarVoluntariado(id) {
  const numId = Number(id);
  const idx = voluntariados.findIndex((v) => Number(v.id) === numId);
  if (idx === -1) return false;
  voluntariados.splice(idx, 1);
  return true;
}
// Esta función la podremos usar mas adelante pero habría que agregar al objeto de datos.js el campo email
// export function voluntariadosPorUsuario(email) {
//   return voluntariados.filter((v) => v.email === email);
// }

// ======== SELECCIONADOS ======== //

export function guardarSeleccionados(voluntariado) {
  const nuevo = {
    ...voluntariado,
    // le damos un id único interno para poder borrarlo
    seleccionadoId: randomUUID(),
  };
  seleccionados.push(nuevo);
  return nuevo;
}

export function listarSeleccionados() {
  return seleccionados;
}

export function borrarSeleccionados(seleccionadoId) {
  const idx = seleccionados.findIndex(
    (v) => v.seleccionadoId === seleccionadoId
  );
  if (idx === -1) return false;
  seleccionados.splice(idx, 1);
  return true;
}
