const express = require('express');
const Incidencia = require('../models/incidencia');
let router = express.Router()

//-------------------------------------------------------------
//----------------------  MÉTODOS GET  ------------------------
//-------------------------------------------------------------

//getAll -> Devuelve todas las incidencias
router.get('/getAll', async (req, res) => {
    try {
        var incidencias = await Incidencia.find()
        res.json({
            status: 'success',
            message: incidencias
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
        var incidencia = await Incidencia.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: incidencia
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});

// Coger las incidencias por status
router.get('/status/:status', async (req, res) => {
    try {
        var status = req.params.status
        var incidencias = await Incidencia.find({ status })
        res.status(200).json({
            status: 'success',
            length: incidencias.length,
            data: incidencias
        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err,
        })
    }
})


//-------------------------------------------------------------
//---------------------  MÉTODOS POST  ------------------------
//-------------------------------------------------------------

//nuevaIncidencia -> Crea una nueva incidencia
router.post('/nuevaIncidencia', async (req, res) => {
    try {
        var { title, user, createdAt, closedAt, assignedTo, description, status, dbIds, files } = req.body;
        var incidencia = new Incidencia({ title, user, createdAt, closedAt, assignedTo, description, status, dbIds, files });
        await incidencia.save();
        res.status(200).json({
            status: 'success',
            data: incidencia
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

//Modifica la incidencia con el id correspondiente
router.patch('/:id', async (req, res) => {
    try {
        var incidencia = await Incidencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            status: 'success',
            data: incidencia
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});

//-------------------------------------------------------------
//-------------------  MÉTODOS DELETE  ------------------------
//-------------------------------------------------------------

//Elimina la incidencia con el id cor
router.delete('/:id', async (req, res) => {
    try {
        var incidencia = await Incidencia.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: `Incidencia ${incidencia} eliminada con éxito`
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
});

module.exports = router;