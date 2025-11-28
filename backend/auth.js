// backend/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Genera un hash de la contraseña.
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
// Clave secreta para firmar JWT (en producción)
const SECRET_KEY = "mi_clave_secreta_uoc2025";

/**
 * Genera un hash de la contraseña.
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
//Genera un hash de la contraseña
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compara una contraseña con su hash.
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash de la contraseña
 * @returns {Promise<boolean>} Verdadero si coinciden
 */
//Compara una contraseña con su hash
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Genera un token JWT con información de usuario.
 * @param {object} usuario - Objeto con {email, rol}
 * @returns {string} Token JWT firmado
 */
// Genera un token JWT con información de usuario
export function generateToken(usuario) {
  return jwt.sign(
    { email: usuario.email, rol: usuario.rol },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

/**
 * Verifica un token JWT y devuelve su payload.
 * @param {string} token - Token JWT
 * @returns {object} Payload con email y rol
 * @throws {Error} Si el token no es válido o ha expirado
 */
// Verifica y decodifica un token JWT
export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
