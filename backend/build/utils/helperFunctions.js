"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyInput = void 0;
const slugifyInput = (str) => {
    return str.toLowerCase().split(' ').join('-');
};
exports.slugifyInput = slugifyInput;
