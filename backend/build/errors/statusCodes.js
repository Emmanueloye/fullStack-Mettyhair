"use strict";
// This class returns statuscodes for each type of error that will be created throughout the application.
Object.defineProperty(exports, "__esModule", { value: true });
class StatusCodes {
    get INTERNAL_SERVER_ERROR() {
        return 500;
    }
    get OK() {
        return 200;
    }
    get CREATED() {
        return 201;
    }
    get NO_CONTENT() {
        return 204;
    }
    get BAD_REQUEST() {
        return 400;
    }
    get UNAUTHORIZED() {
        return 401;
    }
    get FORBIDDEN() {
        return 403;
    }
    get NOT_FOUND() {
        return 404;
    }
    get CONFLICT() {
        return 409;
    }
}
exports.default = new StatusCodes();
