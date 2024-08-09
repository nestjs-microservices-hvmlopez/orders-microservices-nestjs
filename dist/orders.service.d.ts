import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
export declare class OrdersService extends PrismaClient implements OnModuleInit {
    private readonly logger;
    onModuleInit(): void;
    create(createOrdertDto: any): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        totalAmount: number;
        totalItems: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(PaginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            totalAmount: number;
            totalItems: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            paid: boolean;
            paidAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            total: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        totalAmount: number;
        totalItems: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateOrderDto: any): Promise<{
        id: string;
        totalAmount: number;
        totalItems: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        totalAmount: number;
        totalItems: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
