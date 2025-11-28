// controllers/usuarioController.js
import {
  listarUsuarios,
  altaUsuario,
  modificarUsuario,
  borrarUsuario,
  loguearUsuario,
} from "../core/almacenaje.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    console.error("Error al listar usuarios:", err);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

export const postUsuario = async (req, res) => {
  try {
    const usuario = req.body;
    const creado = await altaUsuario(usuario);

    if (!creado) {
      return res
        .status(400)
        .json({ error: "Ya existe un usuario con ese email" });
    }

    res.status(201).json(creado);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const putUsuario = async (req, res) => {
  try {
    const emailOriginal = req.params.email;
    const usuarioActualizado = req.body;

    const actualizado = await modificarUsuario(emailOriginal, usuarioActualizado);

    if (!actualizado) {
      return res
        .status(400)
        .json({ error: "No se pudo modificar el usuario (no existe o email duplicado)" });
    }

    res.json(actualizado);
  } catch (err) {
    console.error("Error al modificar usuario:", err);
    res.status(500).json({ error: "Error al modificar usuario" });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const email = req.params.email;
    const ok = await borrarUsuario(email);

    if (!ok) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error al borrar usuario:", err);
    res.status(500).json({ error: "Error al borrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await loguearUsuario(email, password);

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // aquí podrías generar token JWT, etc. (para la rúbrica de seguridad)
    res.json(usuario);
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en login" });
  }
};
