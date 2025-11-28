//GRAPHQL: Un lenguaje de consultas para APIs.
//En vez de múltiples endpoints REST, tienes un solo endpoint y preguntas exactamente lo que necesitas.

// backend/schema.js
// Esquema GraphQL
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

import { datos } from "./datos.js";

/* ========= Tipos ========= */

const UsuarioType = new GraphQLObjectType({
  name: "Usuario",
  fields: {
    nombre: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    rol: { type: GraphQLString },
  },
});

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
    usuarios: { // Lista de usuarios
      type: new GraphQLList(UsuarioType),
      resolve: () => datos.usuarios,
    },

    categorias: { // Categorías de voluntariados
      type: new GraphQLList(GraphQLString),
      resolve: () => datos.categorias,
    },

    seleccion: { // Voluntariados seleccionados
      type: new GraphQLList(GraphQLString),
      resolve: () => datos.seleccion,
    },

    voluntariados: { // Todos los voluntariados
      type: new GraphQLList(VoluntariadoType),
      resolve: () => datos.voluntariados,
    },

    voluntariado: { // Consulta por ID
      type: VoluntariadoType,
      args: { id: { type: GraphQLInt } },
      resolve: (_, { id }) => datos.voluntariados.find(v => v.id === id),
    },

    voluntariadosPorTipo: { // Nuevo filtro por tipo
      type: new GraphQLList(VoluntariadoType),
      args: { type: { type: GraphQLString } },
      resolve: (_, { type }) =>
        datos.voluntariados.filter(v => v.type === type),
    },

    voluntariadosPorCategoria: { // Nuevo filtro por categoría
      type: new GraphQLList(VoluntariadoType),
      args: { categoria: { type: GraphQLString } },
      resolve: (_, { categoria }) =>
        datos.voluntariados.filter(v => v.categoria === categoria),
    },
  },
});

/* ========= Mutaciones ========= */
// Crear, modificar, eliminar datos
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //Crear nuevo usuario
    altaUsuario: {
      type: UsuarioType,
      args: {
        nombre: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString },
        rol: { type: GraphQLString },
      },
      resolve: (_, usuarioNuevo) => {
        datos.usuarios.push(usuarioNuevo);
        return usuarioNuevo;
      },
    },
    // Crear nuevo voluntariado
    altaVoluntariado: {
      type: VoluntariadoType,
      args: {
        titulo: { type: GraphQLString },
        autor: { type: GraphQLString },
        type: { type: GraphQLString },
        modalidad: { type: GraphQLString },
        categoria: { type: GraphQLString },
        resumen: { type: GraphQLString },
        fecha: { type: GraphQLString },
      },
      resolve: (_, nuevo) => {
        const id = Math.max(...datos.voluntariados.map(v => v.id)) + 1;
        const voluntariado = { id, ...nuevo };
        datos.voluntariados.push(voluntariado);
        return voluntariado;
      },
    },
    // Modificar usuario existente
    modificarUsuario: {
      type: UsuarioType,
      args: {
        emailOriginal: { type: new GraphQLNonNull(GraphQLString) },
        nombre: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        rol: { type: GraphQLString },
      },
      resolve: (_, { emailOriginal, nombre, email, password, rol }) => {
        const usuarioActualizado = { nombre, email, password, rol };
        const indice = datos.usuarios.findIndex(u => u.email === emailOriginal);
        if (indice === -1) return null; // No existe
        
        // Solo actualiza las propiedades definidas
        Object.keys(usuarioActualizado).forEach(key => {
             if (usuarioActualizado[key] !== undefined) {
        datos.usuarios[indice][key] = usuarioActualizado[key];
      }
    });
        return datos.usuarios[indice];
      },
    },
    // Modificar voluntariado existente
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
      resolve: (_, { id, ...datosNuevos }) => {
        const indice = datos.voluntariados.findIndex(v => v.id === id);
        if (indice === -1) return null;
        datos.voluntariados[indice] = { ...datos.voluntariados[indice], ...datosNuevos };
        return datos.voluntariados[indice];
      },
    },
    // Eliminar usuario
    borrarUsuario: {
      type: GraphQLString, // Devuelve mensaje simple
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { email }) => {
        const indice = datos.usuarios.findIndex(u => u.email === email);
        if (indice === -1) return "Usuario no encontrado";
        datos.usuarios.splice(indice, 1);
        return "Usuario eliminado";
      },
    },
    // Eliminar voluntariado
    borrarVoluntariado: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, { id }) => {
        const indice = datos.voluntariados.findIndex(v => v.id === id);
        if (indice === -1) return "Voluntariado no encontrado";
        datos.voluntariados.splice(indice, 1);
        return "Voluntariado eliminado";
      },
    },
  },
});

/* ========= Exportación ========= */

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
