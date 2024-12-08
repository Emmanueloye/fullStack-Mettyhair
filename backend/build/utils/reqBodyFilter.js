"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError = __importStar(require("../errors/appError"));
const fieldCheck = ({ req, includedFields, excludedFields, }) => {
    // Create a copy of the request body
    const incomingReqBody = Object.assign({}, req.body);
    // Create a new object variable to store the manupulated the incoming request body.
    let acceptedBodyObj = {};
    if (includedFields && excludedFields) {
        throw new AppError.ConflictError('You can only specify either includedFields or excludedFields');
    }
    // If includedFields is set, manupulate the incoming request body to delete fields not specified in the includedFields array.
    if (includedFields) {
        includedFields.map((el) => {
            if (incomingReqBody.hasOwnProperty(el)) {
                acceptedBodyObj[el] = incomingReqBody[el];
            }
        });
    }
    // If exludedFields is set, manupulate the incoming request body to delete fields specified in the includedFields array.
    if (excludedFields) {
        excludedFields.forEach((el) => {
            if (incomingReqBody.hasOwnProperty(el)) {
                delete incomingReqBody[el];
            }
            acceptedBodyObj = Object.assign({}, incomingReqBody);
        });
    }
    if (!includedFields && !excludedFields) {
        acceptedBodyObj = Object.assign({}, req.body);
    }
    return acceptedBodyObj;
};
exports.default = fieldCheck;
