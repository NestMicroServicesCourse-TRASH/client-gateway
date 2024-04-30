import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_MICROSERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusOrderDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
	constructor(
		@Inject(ORDERS_MICROSERVICE) private readonly ordersClient: ClientProxy
	) { }

	@Post()
	createOrder(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersClient.send('createOrder', createOrderDto);
	}

	@Get()
	getOrders(@Query() orderPaginationDto: OrderPaginationDto) {
		return this.ordersClient.send('getOrders', orderPaginationDto);
	}

	@Get('id/:id')
	getOrder(@Param('id', ParseUUIDPipe) id: string) {
		return this.ordersClient.send('getOrder', id)
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}

	@Get(':status')
	getOrderByStatus(
		@Param() statusOrderDto: StatusOrderDto,
		@Query() paginationDto: PaginationDto
	) {

		return this.ordersClient.send('getOrders', {
			...paginationDto,
			status: statusOrderDto.status
		})
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}

	@Patch(':id')
	updateOrderStatus(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() statusOrderDto: StatusOrderDto
	) {
		return this.ordersClient.send('updateOrderStatus', { id, status: statusOrderDto.status })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}
}
