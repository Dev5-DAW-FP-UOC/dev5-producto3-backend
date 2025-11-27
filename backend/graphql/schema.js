import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type Usuario {
        nombre: String!
        email: String!
        rol: String!
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

    type Seleccionado {
        id: ID!
        type: String!
        titulo: String!
        autor: String!
        modalidad: String!
        categoria: String!
        resumen: String!
        fecha: String!
    }


    input UsuarioInput {
        nombre: String!
        email: String!
        password: String! # Necesario para alta, aunque no se devuelva
        rol: String
    }

    input UsuarioUpdateInput {
        nombre: String
        email: String
        password: String
        rol: String
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

    input VoluntariadoUpdateInput {
        type: String
        titulo: String
        autor: String
        modalidad: String
        categoria: String
        resumen: String
        fecha: String
    }

    input SeleccionadoInput {
        voluntariadoId: ID!
    }


    type Query {
        usuarios: [Usuario!]!
        voluntariados: [Voluntariado!]!
        seleccionados: [Seleccionado!]!
    }


    type Mutation {
        
        altaUsuario(input: UsuarioInput!): Usuario!
        modificarUsuario(emailOriginal: String!, input: UsuarioUpdateInput!): Usuario!
        borrarUsuario(email: String!): String!
        login(email: String!, password: String!): Usuario!

        
        altaVoluntariado(input: VoluntariadoInput!): Voluntariado!
        modificarVoluntariado(id: ID!, input: VoluntariadoUpdateInput!): Voluntariado!
        borrarVoluntariado(id: ID!): String!

        
        guardarSeleccionado(input: SeleccionadoInput!): Voluntariado!
        borrarSeleccionado(id: ID!): String!
    }
`);