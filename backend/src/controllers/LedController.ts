import { Request, Response } from "express";
import { Control, Discovery, CustomMode } from 'magic-home';
import { TransitionType } from "magic-home/types/lib/CustomMode";
import { convertToRGB } from "../utils/hexToRGB";

import { effects } from "../utils/effects";

const LED_CONTROLLER_IP = '143.255.12.155';

let currentBrightness = 100;
let currentColor = '#FFF';


const ack = { power: true, color: false, pattern: false, custom_pattern: false };
const control = new Control(LED_CONTROLLER_IP, { ack, connect_timeout: 5000 });

export const setPower = async (req: Request, res: Response) => {
    const { power } = req.body;
    const success = await control.setPower(power)
    res.send({ success, power: power ? 'on' : 'off' })
}

export const setColor = async (req: Request, res: Response) => {
    const { color } = req.body;
    currentColor = color;
    const rgb: number[] = convertToRGB(color.replace('#', ''))
    const success = await control.setColor(rgb[0], rgb[1], rgb[2]);
    res.send({ success, currentColor: color })
}

export const setColorAndBrightness = async (req: Request, res: Response) => {
    const { color, brightness } = req.body;
    currentColor = color;
    currentBrightness = brightness;
    const rgb: number[] = convertToRGB(color.replace('#', ''))
    const success = await control.setColorWithBrightness(rgb[0], rgb[1], rgb[2], brightness);
    res.send({ success, currentColor: color, brightness })
}

export const setEffect = async (req: Request, res: Response) => {
    const { effect, speed } = req.body;
    if (!Control.patternNames.includes(effect)) return res.status(400).send('Illegal pattern: ' + effect)
    const success = await control.setPattern(effect, speed);
    res.send({ success, currentEffect: effect, speed });
}

export const customEffect = async (req: Request, res: Response) => {
    let custom = new CustomMode();

    //create a custom effect
    custom
        .addColor(255, 0, 255)
        .addColor(0, 255, 0)
        .addColor(255, 0, 0)
        .addColor(0, 0, 255)
        .setTransitionType("fade" as TransitionType)

    const success = await control.setCustomPattern(custom, 100);
    res.send({ success })
}

export const getEffects = async (req: Request, res: Response) => {
    res.send(effects)
}

export const getStatus = async (req: Request, res: Response) => {
    try {
        const result = await control.queryState();

        //@ts-ignore
        const currEffect = effects.find(item => item.effect === result.pattern);

        res.send({
            ...result,
            hexColor: currentColor,
            effectName: currEffect?.name,
            brightness: currentBrightness,
            device: LED_CONTROLLER_IP
        })
    }
    catch (err) {
        res.send(err)
    }
}

export const scanDevices = async (req: Request, res: Response) => {
    const discovery = new Discovery();
    const scanResult = await discovery.scan(3000);
    res.send(scanResult)
}