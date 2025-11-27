import 'dotenv/config'; 

import app from "./app.js";
import { connectDB } from "./backend/database/config.js"; 

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB(); 

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

startServer();