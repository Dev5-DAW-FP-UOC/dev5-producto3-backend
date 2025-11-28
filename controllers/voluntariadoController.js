// controllers/voluntariadoController.js
import {
  altaVoluntariado,
  listarVoluntariados,
  modificarVoluntariado,
  borrarVoluntariado,
  // voluntariadosPorUsuario,
} from "../core/almacenaje.js";

export const getVoluntariados = (req, res) => {
  const lista = listarVoluntariados();
  res.json(lista);

};

// export const getVoluntariadosPorUsuario = (req, res) => {
//   const { email } = req.params;
//   res.json(voluntariadosPorUsuario(email));
// };

export const postVoluntariado = (req, res) => {
  const nuevo = altaVoluntariado(req.body);
  res.status(201).json(nuevo);
};

export const putVoluntariado = (req, res) => {
  const { id } = req.params;
  const actualizado = modificarVoluntariado(id, req.body);
  if (!actualizado) {
    return res.status(404).json({ error: "Voluntariado no encontrado" });
  }
  res.json(actualizado);
};

export const deleteVoluntariado = (req, res) => {
  const { id } = req.params;
  const ok = borrarVoluntariado(id);
  if (!ok) {
    return res.status(404).json({ error: "Voluntariado no encontrado" });
  }
  res.json({ eliminado: true });
};
