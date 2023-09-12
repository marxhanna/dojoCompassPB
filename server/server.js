// Import necessary modules
require('dotenv').config();
const fs = require('fs');
const https = require('https');
const { urlencoded } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const { createFakeUser } = require('./utils/utils');
const { createTables } = require('./data/data_utils');
const connectionTest = require('./config/database').connectionTest;

// Read SSL certificate files
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate , passphrase: process.env.SSL_PASSPHRASE };

// Middleware setup
app.use(express.json());
app.use(urlencoded({ extended: false }));

// Additional security with helmet
const helmet = require('helmet');
app.use(helmet.frameguard({ action: 'deny' }));

// Route setup
app.use('/',require('./routes/initial/initial'));
app.use('/',require('./routes/csrf/csrf-render-post-method'));
app.use('/',require('./routes/csrf/csrf-get'));
app.use('/',require('./routes/csrf/csrf-post'));
app.use('/',require('./routes/sqli/sqli'));
app.use('/',require('./routes/xss/xss_armazenado'));
app.use('/',require('./routes/xss/xss_refletido'));
app.use('/',require('./routes/broken_authentication/broken_authentication'));
app.use('/',require('./routes/broken_authentication_II/broken_authentication_II'));
app.use('/',require('./routes/broken_authentication_III/broken_authentication_III'));
app.use('/',require('./utils/aux_router'));
//app.use('/', require('./routes/upload/upload'));

// Static files and view engine setup
app.use(express.static(__dirname + '/views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Error handlers
app.use((req, res, next) => {
    const renderData = [];
    renderData.error = '';
    res.status(404).render('error_page', renderData);
});

app.use((err, req, res, next) => {
    console.log('\nSOMETHING WENT WRONG\n');
    console.log(err);
    const renderData = [];
    renderData.error = err;
    res.status(404).render('error_page', renderData);
});

// Create HTTPS server and listen
const porta = process.env.PORT || 3000;
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(porta, async () => {
    console.log(`HTTPS Server running on port ${porta}`);
    await connectionTest();
    const existeUsuario = await createTables();

    if (!existeUsuario) {
        createFakeUser();
    }
});
