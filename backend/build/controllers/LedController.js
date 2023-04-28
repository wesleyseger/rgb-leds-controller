"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanDevices = exports.getStatus = exports.getEffects = exports.customEffect = exports.setEffect = exports.setColorAndBrightness = exports.setColor = exports.setPower = void 0;
const magic_home_1 = require("magic-home");
const hexToRGB_1 = require("../utils/hexToRGB");
const effects_1 = require("../utils/effects");
const LED_CONTROLLER_IP = '143.255.12.155';
let currentBrightness = 100;
let currentColor = '#FFF';
const ack = { power: true, color: false, pattern: false, custom_pattern: false };
const control = new magic_home_1.Control(LED_CONTROLLER_IP, { ack, connect_timeout: 5000 });
const setPower = async (req, res) => {
    const { power } = req.body;
    const success = await control.setPower(power);
    res.send({ success, power: power ? 'on' : 'off' });
};
exports.setPower = setPower;
const setColor = async (req, res) => {
    const { color } = req.body;
    currentColor = color;
    const rgb = (0, hexToRGB_1.convertToRGB)(color.replace('#', ''));
    const success = await control.setColor(rgb[0], rgb[1], rgb[2]);
    res.send({ success, currentColor: color });
};
exports.setColor = setColor;
const setColorAndBrightness = async (req, res) => {
    const { color, brightness } = req.body;
    currentColor = color;
    currentBrightness = brightness;
    const rgb = (0, hexToRGB_1.convertToRGB)(color.replace('#', ''));
    const success = await control.setColorWithBrightness(rgb[0], rgb[1], rgb[2], brightness);
    res.send({ success, currentColor: color, brightness });
};
exports.setColorAndBrightness = setColorAndBrightness;
const setEffect = async (req, res) => {
    const { effect, speed } = req.body;
    if (!magic_home_1.Control.patternNames.includes(effect))
        return res.status(400).send('Illegal pattern: ' + effect);
    const success = await control.setPattern(effect, speed);
    res.send({ success, currentEffect: effect, speed });
};
exports.setEffect = setEffect;
const customEffect = async (req, res) => {
    let custom = new magic_home_1.CustomMode();
    //create a custom effect
    custom
        .addColor(255, 0, 255)
        .addColor(0, 255, 0)
        .addColor(255, 0, 0)
        .addColor(0, 0, 255)
        .setTransitionType("fade");
    const success = await control.setCustomPattern(custom, 100);
    res.send({ success });
};
exports.customEffect = customEffect;
const getEffects = async (req, res) => {
    res.send(effects_1.effects);
};
exports.getEffects = getEffects;
const getStatus = async (req, res) => {
    try {
        const result = await control.queryState();
        const hexColor = "#" +
            componentToHex(result.color.red) +
            componentToHex(result.color.green) +
            componentToHex(result.color.blue);
        //@ts-ignore
        const currEffect = effects_1.effects.find(item => item.effect === result.pattern);
        res.send({
            ...result,
            hexColor: currentColor,
            effectName: currEffect?.name,
            brightness: currentBrightness,
            device: LED_CONTROLLER_IP
        });
    }
    catch (err) {
        res.send(err);
    }
};
exports.getStatus = getStatus;
const scanDevices = async (req, res) => {
    const discovery = new magic_home_1.Discovery();
    const scanResult = await discovery.scan(3000);
    res.send(scanResult);
};
exports.scanDevices = scanDevices;
const componentToHex = (c) => {
    return c.toString(16).padStart(2, '0');
};
