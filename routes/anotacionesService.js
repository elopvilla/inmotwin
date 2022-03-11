const express = require('express');
const Anotacion = require('../models/anotacion');
let router = express.Router();

//-------------------------------------------------------------
//----------------------  MÉTODOS GET  ------------------------
//-------------------------------------------------------------

//getAll -> Devuelve todas las incidencias
router.get('', async (req, res) => {
    try {
        var anotaciones = await Anotacion.find();
        res.json({
            status: 'success',
            data: anotaciones
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});

//Devuelve la incidencia con el id correspondiente
router.get('/:id', async (req, res) => {
    try {
        var anotacion = await Anotacion.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: anotacion
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});

//-------------------------------------------------------------
//---------------------  MÉTODOS POST  ------------------------
//-------------------------------------------------------------

//nuevaIncidencia -> Crea una nueva incidencia
router.post('/crear', async (req, res) => {
    try {
        var { titulo, usuario, prioridad, descripcion, elementos} = req.body;
        var creacion = new Date().getTime();
        var anotacion = new Anotacion({ titulo, usuario, prioridad, creacion, descripcion, elementos });
        await anotacion.save();
        res.status(200).json({
            status: 'success',
            data: anotacion
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});


//-------------------------------------------------------------
//--------------------  MÉTODOS PATCH  ------------------------
//-------------------------------------------------------------

// Modifica la incidencia con el id correspondiente
router.patch('/modificar/:id', async (req, res) => {
    try {
        var anotacion = await Anotacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            status: 'success',
            data: anotacion
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});

module.exports = router;