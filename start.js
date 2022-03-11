const path = require('path');
const express = require('express');
const connectDB = require('./db');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    // return;
}

//Conexión a la base de datos
connectDB();

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use('/api/forge/miprimerapi', require('./routes/miprimerapi'));
app.use('/api/forge/incidencias', require('./routes/incidencias'));
app.use('/api/forge/utilidades', require('./routes/utilidades'));
app.use('/api/forge/anotaciones', require('./routes/anotacionesService'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
