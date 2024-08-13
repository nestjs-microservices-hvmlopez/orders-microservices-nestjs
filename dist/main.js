"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const envs_1 = require("./config/envs");
async function bootstrap() {
    const logger = new common_1.Logger('Main-orders-microservice');
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.NATS,
        options: {
            servers: envs_1.envs.NATS_SERVERS,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen();
    logger.log(`orders microservice is running on port ${envs_1.envs.PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map