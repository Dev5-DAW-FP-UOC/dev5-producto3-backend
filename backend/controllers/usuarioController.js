import * as almacenajeDB from '../core/almacenajeDB.js';

// GET
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await almacenajeDB.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener la lista de usuarios" })
    }
};

// POST
export const postUsuario = async (req, res) => {
    try {
        const nuevoUsuario = req.body;

        const usuarioCreado = await almacenajeDB.altaUsuario(nuevoUsuario);
        res.status(201).json(usuarioCreado);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al registrar el usuario" });
    }
};

// PUT
export const putUsuario = async (req, res) => {
    try {
        const emailOriginal = req.params.email;
        const usuarioActualizado = req.body;

        const usuarioModificado = await almacenajeDB.modificarUsuario(emailOriginal, usuarioActualizado);
        res.status(200).json(usuarioModificado);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al actualizar el usuario" });
    }
};

// DELETE
export const deleteUsuario = async (req, res) => {
    try {
        const email = req.params.email;

        const borrar = await almacenajeDB.borrarUsuario(email);
        res.status(200).json(borrar);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al eliminar el usuario" });
    }
};

// POST (login)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const sesion = await almacenajeDB.loguearUsuario(email, password);
        res.status(200).json(sesion);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al iniciar sesión" });
    }
};