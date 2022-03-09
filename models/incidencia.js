const mongoose = require('mongoose');

const IncidenciaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    closedAt: Date,
    assignedTo: String,
    description: String,
    status: {
        type: String,
        required: true
    },
    dbIds: [{
        type: Number
    }],
    files: [{
        type: String
    }]
});

module.exports = Incidencia = mongoose.model('incidencia', IncidenciaSchema);