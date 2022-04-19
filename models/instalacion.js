const mongoose = require('mongoose');

const InstalacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    emplazamiento: {
        type: String,
        required: true
    },
    fabricante: String,
    referencia: String,
    descripcion: String,
    rutaPlano: String,
    elementos: [{
        type: Number
    }],
});

module.exports = Mantenimiento = mongoose.model('instalacione', InstalacionSchema);