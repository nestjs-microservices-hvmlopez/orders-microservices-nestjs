import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  onModuleInit() {
    this.$connect();
    this.logger.log('database connected for orders service');
  }
  create(createOrdertDto: any) {
    return this.order.create({
      data: createOrdertDto,
    });
  }

  async findAll(PaginationDto: PaginationDto) {
    const { page, limit } = PaginationDto;
    console.log({ page, limit });
    const totalPages = await this.order.count({});
    const lastPage = Math.ceil(totalPages / limit);
    const products = await this.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: products,
      meta: {
        page: page,
        total: totalPages,
        lastPage,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: {
        id,
      },
    });
    if (!order) {
      throw new RpcException({
        message: 'Order not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return order;
  }

  async update(id: string, updateOrderDto: any) {
    const { id: __, ...data } = updateOrderDto;
    const findOrder = await this.findOne(id);
    if (!findOrder) {
      throw new RpcException('Order to update not found');
    }

    const newOrder = await this.order.update({
      where: {
        id,
      },
      data: data,
    });
    return newOrder;
  }

  async remove(id: string) {
    const findOrder = await this.findOne(id);
    if (!findOrder) {
      throw new RpcException('Order to remove not found');
    }
    const order = await this.order.delete({
      where: {
        id,
      },
    });
    return order;
  }
}
