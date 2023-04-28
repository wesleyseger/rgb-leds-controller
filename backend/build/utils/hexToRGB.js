"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRGB = void 0;
const convertToRGB = (hex) => {
    if (hex.length != 6)
        console.log(hex, 'Only 6 hex colors are supported.');
    let aRgbHex = hex.match(/.{1,2}/g);
    let aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
};
exports.convertToRGB = convertToRGB;
