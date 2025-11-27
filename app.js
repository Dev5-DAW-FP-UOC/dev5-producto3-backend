import express from 'express';
import usuarioRoutes from './backend/routes/usuarioRoutes.js';
import voluntariadoRoutes from './backend/routes/voluntariadoRoutes.js';
import seleccionadoRoutes from './backend/routes/seleccionadoRoutes.js';
import authRoutes from './backend/routes/authRoutes.js';

import { graphqlHTTP } from 'express-graphql'; 
import { schema } from './backend/graphql/schema.js';
import { root } from './backend/graphql/root.js';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API Voluntariados funcionando"});
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/voluntariados', voluntariadoRoutes);
app.use('/api/seleccionados', seleccionadoRoutes);
app.use('/api/auth', authRoutes);

export default app;