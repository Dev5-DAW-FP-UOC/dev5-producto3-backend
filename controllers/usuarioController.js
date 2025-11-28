// controllers/usuarioController.js
import {
  altaUsuario,
  listarUsuarios,
  modificarUsuario,
  borrarUsuario,
  loguearUsuario,
} from "../core/almacenaje.js";

export const getUsuarios = (req, res) => {
  const usuarios = listarUsuarios();
  res.json(usuarios);
};

export const postUsuario = (req, res) => {
  const nuevo = altaUsuario(req.body);
  if (!nuevo) {
    return res.status(400).json({ error: "Ya existe un usuario con ese email" });
  }
  res.status(201).json(nuevo);
};

export const putUsuario = (req, res) => {
  const { email } = req.params;
  const actualizado = modificarUsuario(email, req.body);
  if (!actualizado) {
    return res
      .status(404)
      .json({ error: "Usuario no encontrado o email nuevo ya en uso" });
  }
  res.json(actualizado);
};

export const deleteUsuario = (req, res) => {
  const { email } = req.params;
  const ok = borrarUsuario(email);
  if (!ok) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.json({ eliminado: true });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const usuario = loguearUsuario(email, password);
  if (!usuario) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  // Aquí podrías devolver un token más adelante
  res.json({ usuario });
};
