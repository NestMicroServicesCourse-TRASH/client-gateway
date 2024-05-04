import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusOrderDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
	constructor(
		@Inject(NATS_SERVICE) private readonly client: ClientProxy
	) { }

	@Post()
	createOrder(@Body() createOrderDto: CreateOrderDto) {
		return this.client.send('createOrder', createOrderDto);
	}

	@Get()
	getOrders(@Query() orderPaginationDto: OrderPaginationDto) {
		return this.client.send('getOrders', orderPaginationDto);
	}

	@Get('id/:id')
	getOrder(@Param('id', ParseUUIDPipe) id: string) {
		return this.client.send('getOrder', id)
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}

	@Get(':status')
	getOrderByStatus(
		@Param() statusOrderDto: StatusOrderDto,
		@Query() paginationDto: PaginationDto
	) {

		return this.client.send('getOrders', {
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
		return this.client.send('updateOrderStatus', { id, status: statusOrderDto.status })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}
}
