import { OrderStatus } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
export declare class OrderPaginationDto extends PaginationDto {
    status: OrderStatus;
}
