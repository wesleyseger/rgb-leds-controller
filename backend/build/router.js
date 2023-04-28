"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const LedController_1 = require("./controllers/LedController");
exports.router = express_1.default.Router();
exports.router.post('/power', LedController_1.setPower);
exports.router.post('/color', LedController_1.setColor);
exports.router.post('/colorandbrightness', LedController_1.setColorAndBrightness);
exports.router.post('/effect', LedController_1.setEffect);
exports.router.post('/customeffect', LedController_1.customEffect);
exports.router.get('/effects', LedController_1.getEffects);
exports.router.get('/status', LedController_1.getStatus);
exports.router.get('/scan', LedController_1.scanDevices);
