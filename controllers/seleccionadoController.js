// controllers/seleccionadoController.js
import {
  guardarSeleccionados,
  listarSeleccionados,
  borrarSeleccionados,
} from "../core/almacenaje.js";

export const getSeleccionados = (req, res) => {
  res.json(listarSeleccionados());
};

export const postSeleccionado = (req, res) => {
  const nuevo = guardarSeleccionados(req.body);
  res.status(201).json(nuevo);
};

export const deleteSeleccionado = (req, res) => {
  const { id } = req.params; // aquí será el seleccionadoId
  const ok = borrarSeleccionados(id);
  if (!ok) {
    return res.status(404).json({ error: "Seleccionado no encontrado" });
  }
  res.json({ eliminado: true });
};
