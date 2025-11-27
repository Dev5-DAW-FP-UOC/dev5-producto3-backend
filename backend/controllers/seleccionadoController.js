import * as almacenajeDB from '../core/almacenajeDB.js';

// GET
export const getSeleccionados = async (req, res) => {
    try {
        const seleccionados = await almacenajeDB.listarSeleccionados();
        res.status(200).json(seleccionados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener la lista de seleccionados" })
    }
};

// POST
export const postSeleccionado = async (req, res) => {
    try {
        const { voluntariadoId } = req.body;
        const id = parseInt(voluntariadoId); 

        const seleccionadoCreado = await almacenajeDB.guardarSeleccionados(id);
        res.status(201).json(seleccionadoCreado);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al añadir el voluntariado seleccionado" });
    }
};

// DELETE
export const deleteSeleccionado = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const resultado = await almacenajeDB.borrarSeleccionado(id);
        res.status(200).json(resultado);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al eliminar el voluntariado seleccionado" });
    }
};