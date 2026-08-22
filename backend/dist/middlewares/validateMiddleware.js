"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const AppError_js_1 = require("../utils/AppError.js");
function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const issues = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
                return next(new AppError_js_1.AppError(`Validation Error: ${issues}`, 400));
            }
            next(err);
        }
    };
}
