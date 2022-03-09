const fs = require('fs');
const express = require('express');
let router = express.Router()

router.get('/test', (req, res) => {
    var categoria = req.query.categoria;
    res.send('este endpoint funciona' + categorias)
});

router.get('/leer', (req, res) => {
    const texto = fs.readFileSync('./miFichero.txt', 'utf-8');
    res.send(texto);
})

router.post('/test', (req, res) => {
    if (req.body.email === undefined) {
        res.status(400).json({
            status: 'failed',
            message: 'Es necesario indicar el email'
        })
    } else {
        res.json({
            status: 'success',
            data: req.body
        })
    }
})

router.post('/escribir', (req, res) => {
    const texto = req.body.texto;
    const fichero = req.body.fichero;
    fs.writeFileSync(`./${fichero}.txt`, texto)
    res.json({
        status: 'success',
        data: {
            fichero: `${fichero}.txt`,
            texto
        }
    })
})

router.get('/seleccion', (req, res) => {
    const seleccion = JSON.parse(fs.readFileSync('./seleccion.txt', 'utf-8'));
    res.json({
        status: 'success',
        seleccion
    })
});

router.post('/seleccion', (req, res) => {
    const seleccion = JSON.stringify(req.body);
    fs.writeFileSync('./seleccion.txt', seleccion);
    res.json({
        status: 'success',
        message: 'Selección guardada correctamente'
    })
});

router.post('/check', (req, res) => {
    const data = Object.values(req.body);
    data.push('\n');
    var formatData = data.join(';');
    fs.appendFileSync('./checks.csv', formatData);
    res.json({
        status: 'success',
        message: 'Comprobación guardada correctamente'
    })
});

module.exports = router;