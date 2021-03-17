const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors'); //es el que nos permite la comunicacion entre dos url distintas


/* crear el servidor */
const app = express();

/* conectar a la base de datos */
conectarDB();

/* habilitar cors */
app.use(cors());

/* habilitar express.json para poder recibir informacion que carge el usuario.*/
app.use( express.json({ extended: true }));

/* crear puerto de la app */
const PORT = process.env.PORT || 4000;

/* importar rutas */
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

/* arrancar servidor app */  
app.listen(PORT, () => {
    console.log(`el servidor esta funcionando en el puerto ${PORT}`);
});
