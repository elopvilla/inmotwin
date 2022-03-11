const mongoose = require('mongoose');

const AnotacionSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    creacion: Date,
    prioridad: String,
    descripcion: String,
    elementos: [{
        type: Number
    }],
});

module.exports = Incidencia = mongoose.model('anotacione', AnotacionSchema);