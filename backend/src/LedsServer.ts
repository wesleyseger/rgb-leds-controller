import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';

import { router } from './router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const PORT = 5020;
const HOST = '';

const KEY = fs.readFileSync('/etc/letsencrypt/live/rbt.psi.br/privkey.pem');
const CA = fs.readFileSync('/etc/letsencrypt/live/rbt.psi.br/chain.pem');
const CERT = fs.readFileSync('/etc/letsencrypt/live/rbt.psi.br/cert.pem');

const https_options = {
    key: KEY,
    ca: CA,
    cert: CERT
}

https.createServer(https_options, app).listen(PORT, HOST, () => {
    console.log(`Leds Controller HTTPS Listening! Port: ${PORT}`);
})

// app.listen(PORT, () => {
//     return console.log(`Leds Controller listening at PORT ${PORT}.`);
// });