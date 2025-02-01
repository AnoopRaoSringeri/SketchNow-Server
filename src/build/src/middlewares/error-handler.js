"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(error, req, res, next) {
    return res.send(400).json({
        error: error.message,
    });
}
exports.errorHandler = errorHandler;
