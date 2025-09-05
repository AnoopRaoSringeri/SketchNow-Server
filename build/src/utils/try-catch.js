"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = void 0;
function tryCatch(controller) {
    return async (req, res, next) => {
        try {
            return await controller(req, res);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.tryCatch = tryCatch;
