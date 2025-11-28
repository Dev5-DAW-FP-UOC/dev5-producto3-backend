// graphql/root.js
import {
  altaUsuario,
  listarUsuarios,
  modificarUsuario,
  borrarUsuario,
  loguearUsuario,
  altaVoluntariado,
  listarVoluntariados,
  modificarVoluntariado,
  borrarVoluntariado,
  guardarSeleccionados,
  listarSeleccionados,
  borrarSeleccionados,
} from "../core/almacenaje.js";

const root = {
  // ===== QUERIES =====
  usuarios: () => listarUsuarios(),

  voluntariados: () => listarVoluntariados(),

  seleccionados: () => listarSeleccionados(),

  // ===== MUTATIONS =====

  // Usuarios
  altaUsuario: ({ input }) => {
    const creado = altaUsuario(input);
    if (!creado) {
      throw new Error("Ya existe un usuario con ese email");
    }
    return creado;
  },

  modificarUsuario: ({ emailOriginal, input }) => {
    const actualizado = modificarUsuario(emailOriginal, input);
    if (!actualizado) {
      throw new Error("Usuario no encontrado o email nuevo ya en uso");
    }
    return actualizado;
  },

  borrarUsuario: ({ email }) => borrarUsuario(email),

  login: ({ email, password }) => {
    const usuario = loguearUsuario(email, password);
    if (!usuario) {
      throw new Error("Credenciales incorrectas");
    }
    return usuario;
  },

  // Voluntariados
  altaVoluntariado: ({ input }) => altaVoluntariado(input),

  modificarVoluntariado: ({ id, input }) => {
    const actualizado = modificarVoluntariado(id, input);
    if (!actualizado) {
      throw new Error("Voluntariado no encontrado");
    }
    return actualizado;
  },

  borrarVoluntariado: ({ id }) => borrarVoluntariado(id),

  // Seleccionados
  guardarSeleccionado: ({ input }) => guardarSeleccionados(input),

  borrarSeleccionado: ({ id }) => borrarSeleccionados(id),
};

export default root;
