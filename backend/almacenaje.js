// js/almacenaje.js (BACKEND - SIN navegador)

import { datos } from "./datos.js";

/*Estás funciones no es necesarias, ya que ahora no usaremos localStorage ni IndexedDB.
Sin embargo, las dejo comentadas por si quieres reutilizarlas en un entorno de navegador.

export async function inicializarDatos() {
  const usuariosExisten = localStorage.getItem("usuarios");
  if (!usuariosExisten) {
    localStorage.setItem("usuarios", JSON.stringify(datos.usuarios));
    console.log("Usuarios iniciales cargados en localStorage");
  }

  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("voluntariados", "readonly");
    const store = tx.objectStore("voluntariados");
    const countRequest = store.count();
    countRequest.onsuccess = async function () {
      if (countRequest.result === 0) {
        // Si está vacío, agregamos los de ejemplo
        const txAdd = db.transaction("voluntariados", "readwrite");
        const storeAdd = txAdd.objectStore("voluntariados");
        for (const v of datos.voluntariados) {
          storeAdd.add({
          ...v,
          creadoPor: v.creadoPor || v.autor || "Anónimo" // ← usa autor si creadoPor no existe
         });
        }
        txAdd.oncomplete = () => {
          console.log("Voluntariados inicales cargados en IndexedDB");
          resolve(true);
        };
        txAdd.onerror = reject;
      } else {
        resolve(false); // Ya había datos, no se carga nada
      }
    };
    countRequest.onerror = reject;
  });
}

// Categorías disponibles para filtros, tabs, etc.
export function getCategorias() {
  return datos.categorias || ["Todas"];
}
// Seleccion voluntariados propios
export function getSeleccion(){
  return datos.seleccion || ["Todos"];
}
*/

// === CRUD y autenticación para la app de voluntariado ===
// ------ Usuarios  ------

// Añade un nuevo usuario
export function altaUsuario(usuario) {
  const existe = datos.ususarios.some (u=> u.email === usuario.email);
  if (existe) {
    return false; // No permite crear usuario con email ya existente
  }

  datos.usuarios.push(usuario);
  return true;
}

// Devuelve array con todos los usuarios
export function listarUsuarios() {
  return usuarios;
}

// Modificar un usuario por su email
export function modificarUsuario(emailOriginal, usuarioActualizado) {
  const indice = datos.usuarios.findIndex((u) => u.email === emailOriginal);
  if (indice === -1) {
    return false; // No existe ese usuario
  }

  if (usuarioActualizado.email !== emailOriginal) {
    const repetido = datos.usuarios.some((u) => u.email === usuarioActualizado.email);
    if (repetido) {
      return false; // No permite cambiar a un email ya existente
    }
  }
  datos.usuarios[indice] = usuarioActualizado;
  return true;
}

// Elimina un usuario por su email
export function borrarUsuario(email) {
  const indice = datos.usuarios.findIndex((u) => u.email === email);
  if (indice === -1) {
    return false; // No existe ese usuario
  }
  datos.usuarios.splice(indice, 1);
  return true;
}

// Loguea un usuario comprobando email y contraseña
export function loguearUsuario(email, password) {
  const usuario = datos.usuarios.find((u) => u.email === email && u.password === password) || null;
  return usuario;
}

// Guarda el email del usuario
export function guardarUsuarioActivo(email) {
  usuarioActivbo = email;
}

// Devuelve el email del usuario activo
export function obtenerUsuarioActivo() {
  if (!usuarioActivo) return null;
  return datos.usuarios.find((u) => u.email === usuarioActivo) || null;
}

// Cierra sesión
export function logoutUsuario() {
  usuarioActivo = null;
}

// Devuelve el objeto usuario activo, o null si no hay
export function getActiveUser() {
  if (!usuarioActivo) return null;
  return datos.usuarios.find((u) => u.email === usuarioActivo) || null;
}

// (Opcional) helper rápido para comprobar si hay login
export function isLoggedIn() {
  return !!getActiveUser();
}

// ----- Voluntariados -----

let contadorVoluntariados = 1;
/* Abre la base de datos IndexedDB (async)
function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VoluntariadoDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("voluntariados")) {
        db.createObjectStore("voluntariados", { keyPath: "id", autoIncrement: true });
      }

      //almacenaje de voluntariados seleccionados
      if(!db.objectStoreNames.contains("seleccionados")) {
        db.createObjectStore("seleccionados", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = function (event) {
      resolve(event.target.result);
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}*/

// Añade un nuevo voluntariado a la base de datos
export function altaVoluntariado(voluntariado) {
  const nuevo = {...voluntariado,id: contadorVoluntariados++ };
  datos.voluntariados.push(nuevo);
  return nuevo;
}

// Devuelve todos los voluntariados de la base de datos
export  function listarVoluntariados() {
  return datos.voluntariados.map(v => ({
    ...v,
    creadoPor: v.creadoPor || v.autor || "Anónimo"
  }));
}

// Modifica un voluntariado por ID
export function modificarVoluntariado(id, voluntariadoActualizado) {
  const indice = datos.voluntariados.findIndex((v) => v.id === id);
  if (indice === -1) {
    return false; // No existe ese voluntariado
  }

  datos.voluntariados[indice] = { id, ...voluntariadoActualizado };
  return true; 
}

// Elimina un voluntariado por ID
export function borrarVoluntariado(id) {
  const indice = datos.voluntariados.findIndex((v) => v.id === id);
  if (indice === -1) {
    return false; // No existe ese voluntariado
  }

  datos.voluntariados.splice(indice, 1);
  return true;
}

// Devuelve los voluntariados creados por un usuario (email)
export function voluntariadosPorUsuario(email) {
  return datos.voluntariados.filter(v => v.creadoPor === email);
}

// ----- Seleccionados + Categorías -----

let contadorSeleccionados = 1;

// Guarda un voluntariado en seleccionados
export function guardarSeleccionados(voluntariado) {
  const nuevo = {...voluntariado,id: contadorSeleccionados++ };
  datos.seleccion.push(nuevo);
  return nuevo;
}

// Devuelve todos los voluntariados seleccionados
export function listarSeleccionados() {
  return datos.seleccion;
}

// Elimina un voluntariado seleccionado por ID
export function borrarSeleccionados(id) {
 const indice = datos.seleccion.findIndex((v) => v.id === id);
  if (indice === -1) {
    return false; // No existe ese voluntariado
  }

  datos.seleccion.splice(indice, 1);
  return true;
}

// Categorías disponibles para filtros, tabs, etc.
export function getCategorias() {
  return datos.categorias || ["Todas"];
}

export function getSeleccion(){
  return datos.seleccion || ["Todos"];
}