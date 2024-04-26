import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, ORDERS_MICROSERVICE } from 'src/config';

@Module({
	controllers: [OrdersController],
	providers: [],
	imports: [
		ClientsModule.register([
			{
				name: ORDERS_MICROSERVICE,
				transport: Transport.TCP,
				options: {
					host: envs.ordersMicroserviceHost,
					port: envs.ordersMicroservicePort,
				},
			},
		]),
	]
})
export class OrdersModule { }
