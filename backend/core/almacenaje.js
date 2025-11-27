import { datos } from "../database/datos.js";

// Usuarios

export function listarUsuarios(){
	return datos.usuarios.map(({ password, ...user}) => user);
}

export function altaUsuario(nuevoUsuario){
	if (findByEmail(nuevoUsuario.email)) {
        throw { status: 409, message: "El email ya está registrado." };
    }
    const userToSave = { ...nuevoUsuario, rol: nuevoUsuario.rol || 'user' };
    datos.usuarios.push(userToSave);
    const { password, ...userWithoutPass } = userToSave;
    return userWithoutPass;
}

export function modificarUsuario(emailOriginal, datosActualizados){
	const index = datos.usuarios.findIndex(u => u.email === emailOriginal);
    if (index === -1) {
        throw { status: 404, message: "Usuario no encontrado." };
    }
    const updatedUser = { ...datos.usuarios[index], ...datosActualizados };
    
    if (datosActualizados.email && datosActualizados.email !== emailOriginal && findByEmail(datosActualizados.email)) {
        throw { status: 409, message: "El nuevo email ya está registrado por otro usuario." };
    }
    
    datos.usuarios[index] = updatedUser;

    const { password, ...userWithoutPass } = datos.usuarios[index];
    return userWithoutPass;
}

export function borrarUsuario(email){
	const userIndex = datos.usuarios.findIndex(u => u.email === email);

    if (userIndex === -1) {
        throw { status: 404, message: "Usuario no encontrado." };
    }

    datos.usuarios.splice(userIndex, 1);
    return { message: `Usuario ${email} eliminado.` };
}

export function loguearUsuario(email, password){
	const user = findByEmail(email);
    if (!user || user.password !== password) {
        throw { status: 401, message: "Credenciales inválidas." };
    }
    
    const { password: _, ...userWithoutPass } = user;
    datos.session.currentUser = userWithoutPass; 
    
    return userWithoutPass;
}

export function findByEmail(email){
	return datos.usuarios.find(u => u.email === email);
}

// Voluntariados

export function listarVoluntariados(){
	return datos.voluntariados;
}

export function altaVoluntariado(nuevoVoluntariado){
	const id = datos.voluntariados.reduce((max, v) => (v.id > max ? v.id : max), 2000) + 1;
    const voluntariadoCompleto = {  id, ...nuevoVoluntariado };
    datos.voluntariados.push(voluntariadoCompleto);
    return voluntariadoCompleto;
}

export function modificarVoluntariado(id, datosActualizados){
	const index = datos.voluntariados.findIndex(v => v.id === id);
    if (index === -1) {
        throw { status: 404, message: "Voluntariado no encontrado." };
    }
    
    datos.voluntariados[index] = { ...datos.voluntariados[index], ...datosActualizados, id };
    return datos.voluntariados[index];
}

export function borrarVoluntariado(id){
	const voluntariadoIndex = datos.voluntariados.findIndex(v => v.id === id);

    if (voluntariadoIndex === -1) {
        throw { status: 404, message: "Voluntariado no encontrado." };
    }

    datos.voluntariados.splice(voluntariadoIndex, 1);
    return { message: `Voluntariado con ID ${id} eliminado.` };
}

export function findById(id){
	return datos.voluntariados.find(v => v.id === id);
}

// Seleccionados

export function listarSeleccionados(){
	return datos.seleccionados;
}

export function guardarSeleccionados(voluntariadoId){
	const voluntariado = findById(voluntariadoId);
    if (!voluntariado) {
        throw { status: 404, message: `Voluntariado ID ${voluntariadoId} no encontrado.` };
    }
    if (datos.seleccionados.some(s => s.id === voluntariadoId)) {
        throw { status: 409, message: "El voluntariado ya está en la lista de seleccionados." };
    }
    
    datos.seleccionados.push(voluntariado); 
    return voluntariado;
}

export function borrarSeleccionado(voluntariadoId){
	const seleccionadoIndex = datos.seleccionados.findIndex(s => s.id === voluntariadoId);
    
    if (seleccionadoIndex === -1) {
        throw { status: 404, message: "Voluntariado seleccionado no encontrado." };
    }

    datos.seleccionados.splice(seleccionadoIndex, 1);
    return { message: `Voluntariado seleccionado con ID ${voluntariadoId} eliminado.` };
}