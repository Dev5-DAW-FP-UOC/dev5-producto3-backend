// controllers/seleccionadoController.js
import {
  listarSeleccionados,
  guardarSeleccionados,
  borrarSeleccionados,
} from "../core/almacenaje.js";

export const getSeleccionados = async (req, res) => {
  try {
    const seleccionados = await listarSeleccionados();
    res.json(seleccionados);
  } catch (err) {
    console.error("Error al listar seleccionados:", err);
    res.status(500).json({ error: "Error al listar seleccionados" });
  }
};

export const postSeleccionado = async (req, res) => {
  try {
    const voluntariado = req.body; // el voluntariado que se selecciona
    const creado = await guardarSeleccionados(voluntariado);
    res.status(201).json(creado);
  } catch (err) {
    console.error("Error al guardar seleccionado:", err);
    res.status(500).json({ error: "Error al guardar seleccionado" });
  }
};

export const deleteSeleccionado = async (req, res) => {
  try {
    const { id } = req.params; // seleccionadoId (ObjectId como string)
    const ok = await borrarSeleccionados(id);

    if (!ok) {
      return res.status(404).json({ error: "Seleccionado no encontrado" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error al borrar seleccionado:", err);
    res.status(500).json({ error: "Error al borrar seleccionado" });
  }
};
