"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const microservices_1 = require("@nestjs/microservices");
const services_1 = require("../config/services");
const rxjs_1 = require("rxjs");
let OrdersService = class OrdersService extends client_1.PrismaClient {
    constructor(client) {
        super();
        this.client = client;
        this.logger = new common_1.Logger('OrdersService');
    }
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected');
    }
    async create(createOrderDto) {
        try {
            const { items = [] } = createOrderDto;
            const productsIds = items.map((item) => item.productId);
            const products = await (0, rxjs_1.firstValueFrom)(this.client.send({ cmd: 'validate_products' }, productsIds));
            const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
                const price = products.find((product) => product.id === orderItem.productId).price;
                return price * orderItem.quantity + acc;
            }, 0);
            const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
                return orderItem.quantity + acc;
            }, 0);
            const order = await this.order.create({
                data: {
                    totalAmount,
                    totalItems,
                    orderItems: {
                        createMany: {
                            data: createOrderDto.items.map((orderItem) => {
                                return {
                                    price: products.find((product) => product.id === orderItem.productId).price,
                                    quantity: orderItem.quantity,
                                    productId: orderItem.productId,
                                };
                            }),
                        },
                    },
                },
                include: {
                    orderItems: {
                        select: {
                            price: true,
                            quantity: true,
                            productId: true,
                        },
                    },
                },
            });
            return {
                ...order,
                orderItems: order.orderItems.map((orderItem) => {
                    return {
                        ...orderItem,
                        name: products.find((product) => product.id === orderItem.productId)
                            .name,
                    };
                }),
            };
        }
        catch (error) {
            throw new microservices_1.RpcException(error);
        }
    }
    async findAll(orderPaginationDto) {
        const totalPages = await this.order.count({
            where: {
                status: orderPaginationDto.status,
            },
        });
        const currentPage = orderPaginationDto.page;
        const perPage = orderPaginationDto.limit;
        return {
            data: await this.order.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    status: orderPaginationDto.status,
                },
                include: {
                    orderItems: true,
                },
            }),
            meta: {
                total: totalPages,
                page: currentPage,
                lastPage: Math.ceil(totalPages / perPage),
            },
        };
    }
    async findOne(id) {
        const order = await this.order.findFirst({
            where: { id },
            include: {
                orderItems: {
                    select: {
                        price: true,
                        quantity: true,
                        productId: true,
                    },
                },
            },
        });
        if (!order) {
            throw new microservices_1.RpcException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Order with id ${id} not found`,
            });
        }
        const productsIds = order.orderItems.map((orderItem) => orderItem.productId);
        const products = await (0, rxjs_1.firstValueFrom)(this.client.send({ cmd: 'validate_products' }, productsIds));
        return {
            ...order,
            orderItem: order.orderItems.map((orderItem) => {
                return {
                    ...orderItem,
                    name: products.find((product) => product.id === orderItem.productId)
                        .name,
                };
            }),
        };
    }
    async changeStatus(changeOrderStatusDto) {
        const { id, status } = changeOrderStatusDto;
        const order = await this.findOne(id);
        if (order.status === status) {
            return order;
        }
        return this.order.update({
            where: { id },
            data: { status: status },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(services_1.NATS_SERVICE)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersService);
//# sourceMappingURL=orders.service.js.map