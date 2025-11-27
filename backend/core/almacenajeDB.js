import { connectDB, ObjectId } from '../database/config.js';


const getDB = async () => {
    return await connectDB();
};

const mapId = (doc) => {
    if (!doc) return null;
    const { _id, id, ...rest } = doc; 

    if (id !== undefined) {
         return { id, ...rest, _mongoId: _id?.toString() };
    }

    return { id: _id?.toString(), ...rest };
};

const getIdQuery = (id) => {
    let searchId = id;
    
    if (typeof id === 'string') {
        const numId = parseInt(id, 10);
        if (!isNaN(numId)) {
            searchId = numId;
        }
    }

    if (typeof searchId === 'number') {
        return { id: searchId };
    }

    if (ObjectId.isValid(searchId)) {
         try {
            return { _id: new ObjectId(searchId) };
        } catch (e) {
        }
    }

    return { id: searchId };
};

export const getVoluntariadoByIdDB = async (id) => {
    const db = await getDB();
    const query = getIdQuery(id); 
    
    const voluntariado = await db.collection('voluntariados').findOne(query);
    
    return mapId(voluntariado);
};

// Usuarios
export const listarUsuarios = async () => {
    const db = await getDB();

    const usuarios = await db.collection('usuarios').find({}, { projection: { password: 0 } }).toArray();
    return usuarios.map(u => ({ 
        ...u, 
        id: u._id.toString()
    }));
};

export const altaUsuario = async (nuevoUsuario) => {
    const db = await getDB();

    const existe = await db.collection('usuarios').findOne({ email: nuevoUsuario.email });
    if (existe) {
        const error = new Error("El email ya está registrado.");
        error.status = 409; 
        throw error;
    }
    
    const resultado = await db.collection('usuarios').insertOne(nuevoUsuario);
    
    const { password, ...usuarioCreado } = nuevoUsuario;
    return { 
        ...usuarioCreado, 
        id: resultado.insertedId.toString()
    };
};

export const loguearUsuario = async (email, password) => {
    const db = await getDB();
    
    const usuario = await db.collection('usuarios').findOne({ email });
    
    if (!usuario || usuario.password !== password) {
        const error = new Error("Credenciales incorrectas.");
        error.status = 401; 
        throw error;
    }
    
    const { password: userPassword, ...usuarioLogueado } = usuario;
    return { ...usuarioLogueado, id: usuario._id.toString() }; 
};

export const modificarUsuario = async (emailOriginal, input) => {
    const db = await getDB();
    
    const updateDocument = { $set: input };
    
    const resultado = await db.collection('usuarios').findOneAndUpdate(
        { email: emailOriginal },
        updateDocument,
        { returnDocument: 'after', projection: { password: 0 } }
    );
    
    if (!resultado.value) {
        const error = new Error("Usuario no encontrado.");
        error.status = 404;
        throw error;
    }
    
    return { ...resultado.value, id: resultado.value._id.toString() };
};

export const borrarUsuario = async (email) => {
    const db = await getDB();
    
    const resultado = await db.collection('usuarios').deleteOne({ email });
    
    if (resultado.deletedCount === 0) {
        const error = new Error("Usuario no encontrado para borrar.");
        error.status = 404;
        throw error;
    }
    return { message: "Usuario borrado exitosamente." };
};

// Voluntariados
export const listarVoluntariados = async () => {
    const db = await getDB();
    const voluntariados = await db.collection('voluntariados').find({}).toArray();
    return voluntariados.map(v => ({ 
        ...v, 
        id: v._id.toString()
    }));
};

export const altaVoluntariado = async (nuevoVoluntariado) => {
    const db = await getDB();

    const maxIdResult = await db.collection('voluntariados')
        .find({})
        .sort({ id: -1 })
        .toArray();

    let currentMaxId = 2000;

    if (maxIdResult.length > 0) {
        const dbId = parseInt(maxIdResult[0].id, 10);
        if (!isNaN(dbId)) {
            currentMaxId = Math.max(currentMaxId, dbId);
        }
    }

    const nuevoId = (currentMaxId + 1);

    const voluntariadoCompleto = {
        id: nuevoId,
        ...nuevoVoluntariado
    };

    await db.collection('voluntariados').insertOne(voluntariadoCompleto);

    return voluntariadoCompleto;
};

export const modificarVoluntariado = async (id, voluntariadoActualizado) => {
    const db = await getDB();
     const query = getIdQuery(id);

    const payload = { ...voluntariadoActualizado };
    delete payload.id;
    delete payload._id; 
    delete payload._mongoId; 

    const updateDocument = { $set: payload };

    const resultado = await db.collection('voluntariados').findOneAndUpdate(
        query,
        updateDocument,
        { returnDocument: 'after' }
    );

    if (!resultado.value) {
        const error = new Error(`Voluntariado con ID ${id} no encontrado.`);
        error.status = 404;
        throw error;
    }
    
    return mapId(resultado.value);
};

export const borrarVoluntariado = async (id) => {
    const db = await getDB();
    const query = getIdQuery(id);

    const resultado = await db.collection('voluntariados').deleteOne(query);
    
    if (resultado.deletedCount === 0) {
        const error = new Error(`Voluntariado con ID ${id} no encontrado para borrar.`);
        error.status = 404;
        throw error;
    }
    return { message: "Voluntariado borrado exitosamente." };
};

// Seleccionados
export const listarSeleccionados = async () => {
    const db = await getDB();
    const seleccionados = await db.collection('seleccionados').find({}).toArray();
    return seleccionados.map(s => ({ 
        ...s, 
        id: s._id.toString(),
        // Convertir voluntariadoId a string si está almacenado como ObjectId
        voluntariadoId: s.voluntariadoId.toString()
    })); 
};

export const guardarSeleccionados = async (voluntariadoId) => {
    const db = await getDB();
    
    const voluntariadoNumId = parseInt(voluntariadoId, 10);
    if (isNaN(voluntariadoNumId)) {
         const error = new Error("El ID del voluntariado no es válido.");
         error.status = 400;
         throw error;
    }

    const voluntariadoExistente = await getVoluntariadoByIdDB(voluntariadoNumId);

    if (!voluntariadoExistente) {
        const error = new Error("Voluntariado no encontrado.");
        error.status = 404;
        throw error;
    }

    const existe = await db.collection('seleccionados').findOne({ 
        voluntariadoId: voluntariadoNumId, 
    });
    
    if (existe) {
        const error = new Error(`El voluntariado con ID ${voluntariadoNumId} ya existe en la lista de seleccionados.`);
        error.status = 409; // Conflict
        throw error;
    }
    
    const { _mongoId, id, ...voluntariadoFields } = voluntariadoExistente;

    const nuevoSeleccionado = { 
        voluntariadoId: voluntariadoNumId, 
        ...voluntariadoFields 
    };

    const resultado = await db.collection('seleccionados').insertOne(nuevoSeleccionado);

    return { 
        id: resultado.insertedId.toString(),
        voluntariadoId: voluntariadoNumId,
        ...voluntariadoFields
    };
};

export const borrarSeleccionado = async (id) => {
    const db = await getDB();
    const numId = parseInt(id, 10);
    const query = { voluntariadoId: numId };

    const resultado = await db.collection('seleccionados').deleteOne(query);
    
    if (resultado.deletedCount === 0) {
        const error = new Error(`Seleccionado con ID ${id} no encontrado para borrar.`);
        error.status = 404;
        throw error;
    }
    return { message: "Seleccionado borrado exitosamente." };
};