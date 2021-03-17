const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, //cada usuario tiene su propio id y eso es lo que guardamos como referencia
        ref:'Usuario' // nombre del modelo de donde obtenemos el ObjectId.
    },
    creado: {
        type: Date,
        default: Date.now()
       
    }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);