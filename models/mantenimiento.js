const mongoose = require('mongoose');

const MantenimientoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    fecha: Date,
    fechaRealizado: Date,
    realizado: Boolean,
    prioridad: String,
    descripcion: String,
    observaciones: String,
    elementos: [{
        type: Number
    }],
});

module.exports = Mantenimiento = mongoose.model('mantenimiento', MantenimientoSchema);