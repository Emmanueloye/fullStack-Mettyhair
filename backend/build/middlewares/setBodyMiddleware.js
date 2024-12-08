"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpdateDetails = exports.setCreationDetails = void 0;
const setCreationDetails = (req, res, next) => {
    if (!req.body.createdAt)
        req.body.createdAt = new Date(Date.now());
    if (!req.body.createdBy)
        req.body.createdBy = req.user.id;
    next();
};
exports.setCreationDetails = setCreationDetails;
const setUpdateDetails = (req, res, next) => {
    if (!req.body.updatedAt)
        req.body.updatedAt = new Date(Date.now());
    if (!req.body.updatedBy)
        req.body.updatedBy = req.user.id;
    next();
};
exports.setUpdateDetails = setUpdateDetails;
