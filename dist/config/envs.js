"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const joi = require("joi");
const envSchema = joi
    .object({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
})
    .unknown(true);
const { error, value } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const envVars = value;
exports.envs = {
    PORT: envVars.PORT,
    DATABASE_URL: envVars.DATABASE_URL,
    DB_NAME: envVars.DB_NAME,
    DB_PASSWORD: envVars.DB_PASSWORD,
    DB_HOST: envVars.DB_HOST,
    DB_PORT: envVars.DB_PORT,
    DB_USER: envVars.DB_USER,
};
//# sourceMappingURL=envs.js.map