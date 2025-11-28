// backend/schema.js
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

import { hashPassword, comparePassword, generateToken } from "./auth.js";

/* ========= Tipos ========= */

/**
 * Tipo GraphQL para Usuario
 * @typedef {Object} Usuario
 * @property {string} nombre
 * @property {string} email
 * @property {string} password
 * @property {string} rol
 * @property {string} token - JWT generado al hacer login
 */
const UsuarioType = new GraphQLObjectType({
  name: "Usuario",
  fields: {
    nombre: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    rol: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

/**
 * Tipo GraphQL para Voluntariado
 * @typedef {Object} Voluntariado
 * @property {number} id
 * @property {string} type
 * @property {string} titulo
 * @property {string} autor
 * @property {string} modalidad
 * @property {string} categoria
 * @property {string} resumen
 * @property {string} fecha
 */
const VoluntariadoType = new GraphQLObjectType({
  name: "Voluntariado",
  fields: {
    id: { type: GraphQLInt },
    type: { type: GraphQLString },
    titulo: { type: GraphQLString },
    autor: { type: GraphQLString },
    modalidad: { type: GraphQLString },
    categoria: { type: GraphQLString },
    resumen: { type: GraphQLString },
    fecha: { type: GraphQLString },
  },
});

/* ========= Query ========= */

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    /**
     * Obtiene todos los usuarios
     * @returns {Promise<Array<Usuario>>}
     */
    usuarios: {
      type: new GraphQLList(UsuarioType),
      async resolve(_, __, { db }) {
        return db.collection("usuarios").find().toArray();
      },
    },

    /**
     * Obtiene todos los voluntariados
     * @returns {Promise<Array<Voluntariado>>}
     */
    voluntariados: {
      type: new GraphQLList(VoluntariadoType),
      async resolve(_, __, { db }) {
        return db.collection("voluntariados").find().toArray();
      },
    },

    /**
     * Obtiene un voluntariado por su ID
     * @param {Object} args - {id}
     * @param {number} args.id
     * @returns {Promise<Voluntariado>}
     */
    voluntariado: {
      type: VoluntariadoType,
      args: { id: { type: GraphQLInt } },
      async resolve(_, { id }, { db }) {
        return db.collection("voluntariados").findOne({ id });
      },
    },

    /**
     * Filtra voluntariados por tipo
     * @param {Object} args - {type}
     * @param {string} args.type
     * @returns {Promise<Array<Voluntariado>>}
     */
    voluntariadosPorTipo: {
      type: new GraphQLList(VoluntariadoType),
      args: { type: { type: GraphQLString } },
      async resolve(_, { type }, { db }) {
        return db.collection("voluntariados").find({ type }).toArray();
      },
    },

    /**
     * Filtra voluntariados por categoría
     * @param {Object} args - {categoria}
     * @param {string} args.categoria
     * @returns {Promise<Array<Voluntariado>>}
     */
    voluntariadosPorCategoria: {
      type: new GraphQLList(VoluntariadoType),
      args: { categoria: { type: GraphQLString } },
      async resolve(_, { categoria }, { db }) {
        return db.collection("voluntariados").find({ categoria }).toArray();
      },
    },
  },
});

/* ========= Mutaciones ========= */

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /**
     * Crea un nuevo usuario con password hasheada
     * @param {Object} usuarioNuevo
     * @param {string} usuarioNuevo.nombre
     * @param {string} usuarioNuevo.email
     * @param {string} usuarioNuevo.password
     * @param {string} usuarioNuevo.rol
     * @param {Object} context - {db}
     * @returns {Promise<Usuario>}
     */
    altaUsuario: {
      type: UsuarioType,
      args: {
        nombre: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString },
        rol: { type: GraphQLString },
      },
      async resolve(_, usuarioNuevo, { db }) {
        if (usuarioNuevo.password) {
          usuarioNuevo.password = await hashPassword(usuarioNuevo.password);
        }
        await db.collection("usuarios").insertOne(usuarioNuevo);
        return usuarioNuevo;
      },
    },

    /**
     * Login de usuario y devuelve token JWT
     * @param {Object} args - {email, password}
     * @param {Object} context - {db}
     * @returns {Promise<Usuario>} Usuario con token
     * @throws {Error} Contraseña incorrecta o usuario no encontrado
     */
    login: {
      type: UsuarioType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { email, password }, { db }) {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) throw new Error("Usuario no encontrado");
        const valid = await comparePassword(password, usuario.password);
        if (!valid) throw new Error("Contraseña incorrecta");

        const token = generateToken(usuario);
        return { ...usuario, token };
      },
    },

    /**
     * Modifica un usuario existente
     * @param {Object} args - {emailOriginal, nombre?, email?, password?, rol?}
     * @param {Object} context - {db}
     * @returns {Promise<Usuario>}
     */
    modificarUsuario: {
      type: UsuarioType,
      args: {
        emailOriginal: { type: new GraphQLNonNull(GraphQLString) },
        nombre: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        rol: { type: GraphQLString },
      },
      async resolve(_, { emailOriginal, ...campos }, { db }) {
        const result = await db.collection("usuarios").findOneAndUpdate(
          { email: emailOriginal },
          { $set: campos },
          { returnDocument: "after" }
        );
        return result.value;
      },
    },

    /**
     * Elimina un usuario por email
     * @param {Object} args - {email}
     * @param {Object} context - {db}
     * @returns {Promise<string>} Mensaje de éxito o error
     */
    borrarUsuario: {
      type: GraphQLString,
      args: { email: { type: new GraphQLNonNull(GraphQLString) } },
      async resolve(_, { email }, { db }) {
        const result = await db.collection("usuarios").deleteOne({ email });
        return result.deletedCount ? "Usuario eliminado" : "Usuario no encontrado";
      },
    },

    /**
     * Crea un voluntariado
     * @param {Object} voluntariadoNuevo
     * @param {Object} context - {db}
     * @returns {Promise<Voluntariado>}
     */
    altaVoluntariado: {
      type: VoluntariadoType,
      args: {
        id: { type: GraphQLInt },
        titulo: { type: GraphQLString },
        autor: { type: GraphQLString },
        type: { type: GraphQLString },
        modalidad: { type: GraphQLString },
        categoria: { type: GraphQLString },
        resumen: { type: GraphQLString },
        fecha: { type: GraphQLString },
      },
      async resolve(_, voluntariadoNuevo, { db }) {
        if (!voluntariadoNuevo.id) {
          const last = await db.collection("voluntariados")
            .find()
            .sort({ id: -1 })
            .limit(1)
            .toArray();
          voluntariadoNuevo.id = last.length ? last[0].id + 1 : 1;
        }
        await db.collection("voluntariados").insertOne(voluntariadoNuevo);
        return voluntariadoNuevo;
      },
    },

    /**
     * Modifica un voluntariado existente
     * @param {Object} args - {id, ...campos}
     * @param {Object} context - {db}
     * @returns {Promise<Voluntariado>}
     */
    modificarVoluntariado: {
      type: VoluntariadoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        titulo: { type: GraphQLString },
        autor: { type: GraphQLString },
        type: { type: GraphQLString },
        modalidad: { type: GraphQLString },
        categoria: { type: GraphQLString },
        resumen: { type: GraphQLString },
        fecha: { type: GraphQLString },
      },
      async resolve(_, { id, ...campos }, { db }) {
        const result = await db.collection("voluntariados").findOneAndUpdate(
          { id },
          { $set: campos },
          { returnDocument: "after" }
        );
        return result.value;
      },
    },

    /**
     * Elimina un voluntariado por id
     * @param {Object} args - {id}
     * @param {Object} context - {db}
     * @returns {Promise<string>} Mensaje de éxito o error
     */
    borrarVoluntariado: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      async resolve(_, { id }, { db }) {
        const result = await db.collection("voluntariados").deleteOne({ id });
        return result.deletedCount ? "Voluntariado eliminado" : "Voluntariado no encontrado";
      },
    },
  },
});

/* ========= Exportación ========= */

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
