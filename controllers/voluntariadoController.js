// controllers/voluntariadoController.js
import {
  listarVoluntariados,
  altaVoluntariado,
  modificarVoluntariado,
  borrarVoluntariado,
} from "../core/almacenaje.js";

export const getVoluntariados = async (req, res) => {
  try {
    const voluntariados = await listarVoluntariados();
    res.json(voluntariados);
  } catch (err) {
    console.error("Error al listar voluntariados:", err);
    res.status(500).json({ error: "Error al listar voluntariados" });
  }
};

export const postVoluntariado = async (req, res) => {
  try {
    const voluntariado = req.body;
    const creado = await altaVoluntariado(voluntariado);
    res.status(201).json(creado);
  } catch (err) {
    console.error("Error al crear voluntariado:", err);
    res.status(500).json({ error: "Error al crear voluntariado" });
  }
};

export const putVoluntariado = async (req, res) => {
  try {
    const { id } = req.params;
    const voluntariadoActualizado = req.body;

    const actualizado = await modificarVoluntariado(id, voluntariadoActualizado);

    if (!actualizado) {
      return res.status(404).json({ error: "Voluntariado no encontrado" });
    }

    res.json(actualizado);
  } catch (err) {
    console.error("Error al modificar voluntariado:", err);
    res.status(500).json({ error: "Error al modificar voluntariado" });
  }
};

export const deleteVoluntariado = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await borrarVoluntariado(id);

    if (!ok) {
      return res.status(404).json({ error: "Voluntariado no encontrado" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error al borrar voluntariado:", err);
    res.status(500).json({ error: "Error al borrar voluntariado" });
  }
};
