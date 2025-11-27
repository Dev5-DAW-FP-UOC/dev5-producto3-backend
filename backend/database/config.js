import { MongoClient, ObjectId } from 'mongodb';


const DB_CNN = process.env.DB_CNN; 

const DB_NAME = 'voluntariadosDB'; 


if (!DB_CNN) {
    console.error("ERROR: La variable DB_CNN no está definida en .env. Por favor, revisa tu archivo .env.");
    process.exit(1);
}

let db; // Variable para almacenar la instancia de la base de datos conectada

export const connectDB = async () => {
    // Si la conexión ya está establecida, simplemente la retornamos.
    if (db) {
        return db; 
    } 

    const client = new MongoClient(DB_CNN);
    
    try {
        console.log('🔗 Intentando conectar a MongoDB Atlas...');
        
        // Conectar el cliente
        await client.connect();
        
        // Obtener la instancia de la base de datos
        db = client.db(DB_NAME);
        
        console.log('Conectado a MongoDB Atlas exitosamente (Driver Nativo).');
        return db;

    } catch (error) {
        console.error('Error fatal al conectar a MongoDB Atlas:', error.message);
        // Si hay un error de conexión, terminamos la aplicación
        process.exit(1); 
    }
};

export { ObjectId };