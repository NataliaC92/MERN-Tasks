const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true // para evitar tener dos usuarios con el mismo correo, corrobora que ya no se encuentre el email en la DB
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now() // para generar fecha en el momento en que se realiza el registro
    }    
});

/* decimos a mongoose que vamos a registrar el modelo usuario, con el schema UsuariosSchema */
module.exports = mongoose.model('Usuario', UsuariosSchema);