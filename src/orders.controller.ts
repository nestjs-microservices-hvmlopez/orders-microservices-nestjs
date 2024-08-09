import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller('orders')
export class ProductsController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({
    cmd: 'orders_product',
  })
  create(@Payload() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  // @Get()
  @MessagePattern({
    cmd: 'find_all_orders',
  })
  findAll(@Payload() PaginationDto: PaginationDto) {
    return this.ordersService.findAll(PaginationDto);
  }

  // @Get(':id')
  @MessagePattern({
    cmd: 'find_one_order',
  })
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({
    cmd: 'update_order',
  })
  update(@Payload() updateOrderDto: any) {
    return this.ordersService.update(updateOrderDto.id, updateOrderDto);
  }

  // @Delete(':id')
  @MessagePattern({
    cmd: 'delete_order',
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
