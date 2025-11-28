// graphql/schema.js
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Usuario {
    nombre: String!
    email: String!
    password: String!
    rol: String
  }

  input UsuarioInput {
    nombre: String!
    email: String!
    password: String!
    rol: String
  }

  type Voluntariado {
    id: ID!
    type: String!
    titulo: String!
    autor: String!
    modalidad: String!
    categoria: String!
    resumen: String!
    fecha: String!
  }

  input VoluntariadoInput {
    type: String!
    titulo: String!
    autor: String!
    modalidad: String!
    categoria: String!
    resumen: String!
    fecha: String!
  }

  type Seleccionado {
    seleccionadoId: ID!
    id: ID!
    type: String!
    titulo: String!
    autor: String!
    modalidad: String!
    categoria: String!
    resumen: String!
    fecha: String!
  }

  input SeleccionadoInput {
    id: ID!
    type: String!
    titulo: String!
    autor: String!
    modalidad: String!
    categoria: String!
    resumen: String!
    fecha: String!
  }

  type Query {
    usuarios: [Usuario!]!
    voluntariados: [Voluntariado!]!
    seleccionados: [Seleccionado!]!
  }

  type Mutation {
    # Usuarios
    altaUsuario(input: UsuarioInput!): Usuario
    modificarUsuario(emailOriginal: String!, input: UsuarioInput!): Usuario
    borrarUsuario(email: String!): Boolean!
    login(email: String!, password: String!): Usuario

    # Voluntariados
    altaVoluntariado(input: VoluntariadoInput!): Voluntariado
    modificarVoluntariado(id: ID!, input: VoluntariadoInput!): Voluntariado
    borrarVoluntariado(id: ID!): Boolean!

    # Seleccionados
    guardarSeleccionado(input: SeleccionadoInput!): Seleccionado
    borrarSeleccionado(id: ID!): Boolean!
  }
`);

export default schema;
