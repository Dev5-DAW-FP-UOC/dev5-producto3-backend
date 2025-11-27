import * as almacenajeDB from '../core/almacenajeDB.js';

export const root = {
    // QUERIES
    usuarios: async() => {
        return await almacenajeDB.listarUsuarios();
    },
    voluntariados: async() => {
        return await almacenajeDB.listarVoluntariados();
    },
    seleccionados: async() => {
        return await almacenajeDB.listarSeleccionados();
    },

    // MUTATIONS

    // Usuarios
    altaUsuario: async({ input }) => {
        try {
            return await almacenajeDB.altaUsuario(input);
        } catch (error) {
            throw new Error(error.message || "Error al dar de alta el usuario");
        }
    },

    modificarUsuario: async({ emailOriginal, input }) => {
        try {
            return await almacenajeDB.modificarUsuario(emailOriginal, input);
        } catch (error) {
            throw new Error(error.message || "Error al modificar el usuario");
        }
    },

    borrarUsuario: async({ email }) => {
        try {
            const result = await almacenajeDB.borrarUsuario(email);
            return result.message;
        } catch (error) {
            throw new Error(error.message || "Error al borrar el usuario");
        }
    },

    login: async({ email, password }) => {
        try {
            return await almacenajeDB.loguearUsuario(email, password);
        } catch (error) {
            if (error.status === 401) {
                throw new Error("Credenciales incorrectas o usuario no encontrado");
            }
            throw new Error(error.message || "Error al intentar iniciar sesión");
        }
    },
    
    // Voluntariados
    altaVoluntariado: async({ input }) => {
        try {
            return await almacenajeDB.altaVoluntariado(input);
        } catch (error) {
            throw new Error(error.message || "Error al dar de alta el voluntariado");
        }
    },

    modificarVoluntariado: async({ id, input }) => {
        try {
            return await almacenajeDB.modificarVoluntariado(id, input);
        } catch (error) {
            throw new Error(error.message || "Error al modificar el voluntariado");
        }
    },

    borrarVoluntariado: async({ id }) => {
        try {
            const result = await almacenajeDB.borrarVoluntariado(id);
            return result.message;
        } catch (error) {
            throw new Error(error.message || "Error al borrar el voluntariado");
        }
    },

    // Seleccionados
    guardarSeleccionado: async({ input }) => {
        try {
            return await almacenajeDB.guardarSeleccionados(input.voluntariadoId);
        } catch (error) {
            throw new Error(error.message || "Error al guardar el seleccionado");
        }
    },

    borrarSeleccionado: async({ id }) => {
        try {
            const result = await almacenajeDB.borrarSeleccionado(id);
            return result.message;
        } catch (error) {
            throw new Error(error.message || "Error al borrar el seleccionado");
        }
    }
};