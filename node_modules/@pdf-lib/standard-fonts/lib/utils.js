"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * The `chars`, `lookup`, and `decodeFromBase64` members of this file are
 * licensed under the following:
 *
 *     base64-arraybuffer
 *     https://github.com/niklasvh/base64-arraybuffer
 *
 *     Copyright (c) 2012 Niklas von Hertzen
 *     Licensed under the MIT license.
 *
 */
var pako_1 = __importDefault(require("pako"));
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
exports.decodeFromBase64 = function (base64) {
    var bufferLength = base64.length * 0.75;
    var len = base64.length;
    var i;
    var p = 0;
    var encoded1;
    var encoded2;
    var encoded3;
    var encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var bytes = new Uint8Array(bufferLength);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return bytes;
};
var arrayToString = function (array) {
    var str = '';
    for (var i = 0; i < array.length; i++) {
        str += String.fromCharCode(array[i]);
    }
    return str;
};
exports.decompressJson = function (compressedJson) {
    return arrayToString(pako_1.default.inflate(exports.decodeFromBase64(compressedJson)));
};
exports.padStart = function (value, length, padChar) {
    var padding = '';
    for (var idx = 0, len = length - value.length; idx < len; idx++) {
        padding += padChar;
    }
    return padding + value;
};
