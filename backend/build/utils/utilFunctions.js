"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = exports.getPathText = void 0;
const getPathText = (str) => {
    return str.split('/').at(-1);
};
exports.getPathText = getPathText;
const slugify = (str) => {
    return str.split(' ').join('-');
};
exports.slugify = slugify;
