import express from "express";

import { getStatus, setColor, setPower, scanDevices, setEffect, getEffects, setColorAndBrightness, customEffect } from "./controllers/LedController";

export const router = express.Router();

router.post('/power', setPower);

router.post('/color', setColor);
router.post('/colorandbrightness', setColorAndBrightness);

router.post('/effect', setEffect);
router.post('/customeffect', customEffect);

router.get('/effects', getEffects);
router.get('/status', getStatus);
router.get('/scan', scanDevices);