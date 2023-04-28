"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const router_1 = require("./router");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(router_1.router);
const PORT = 5020;
const HOST = '';
const KEY = fs_1.default.readFileSync('/etc/letsencrypt/live/rbt.psi.br/privkey.pem');
const CA = fs_1.default.readFileSync('/etc/letsencrypt/live/rbt.psi.br/chain.pem');
const CERT = fs_1.default.readFileSync('/etc/letsencrypt/live/rbt.psi.br/cert.pem');
const https_options = {
    key: KEY,
    ca: CA,
    cert: CERT
};
https_1.default.createServer(https_options, app).listen(PORT, HOST, () => {
    console.log(`Leds Controller HTTPS Listening! Port: ${PORT}`);
});
// app.listen(PORT, () => {
//     return console.log(`Leds Controller listening at PORT ${PORT}.`);
// });
