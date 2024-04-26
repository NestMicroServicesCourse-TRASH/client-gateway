import { Controller, Get, Post, Body, Patch, Param, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { ORDERS_MICROSERVICE } from 'src/config';

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
	getOrders(@Query() paginationDto: PaginationDto) {
		return this.ordersClient.send('getOrders', paginationDto);
	}

	@Get(':id')
	getOrder(@Param('id', ParseIntPipe) id: number) {
		return this.ordersClient.send('getOrder', id);
	}

	@Patch(':id')
	updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
		return this.ordersClient.send('updateOrderStatus', {
			id,
			...updateOrderDto
		});
	}

}
