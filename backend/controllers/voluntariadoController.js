import * as almacenajeDB from '../core/almacenajeDB.js';

// GET
export const getVoluntariados = async (req, res) => {
    try {
        const voluntariados = await almacenajeDB.listarVoluntariados();
        res.status(200).json(voluntariados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener la lista de voluntariados" })
    }
};

// POST
export const postVoluntariado = async (req, res) => {
    try {
        const nuevoVoluntariado = req.body;

        const voluntariadoCreado = await almacenajeDB.altaVoluntariado(nuevoVoluntariado);
        res.status(201).json(voluntariadoCreado);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al registrar el voluntariado" });
    }
};

// PUT
export const putVoluntariado = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const voluntariadoActualizado = req.body;

        const voluntariadoModificado = await almacenajeDB.modificarVoluntariado(id, voluntariadoActualizado);
        res.status(200).json(voluntariadoModificado);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al actualizar el voluntariado" });
    }
};

// DELETE
export const deleteVoluntariado = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const borrar = await almacenajeDB.borrarVoluntariado(id);
        res.status(200).json(borrar);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al eliminar el voluntariado" });
    }
};