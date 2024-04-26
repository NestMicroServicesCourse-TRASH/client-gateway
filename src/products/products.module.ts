import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCTS_MICROSERVICE } from 'src/config';

@Module({
	controllers: [ProductsController],
	providers: [],
	imports: [
		ClientsModule.register([
			{
				name: PRODUCTS_MICROSERVICE,
				transport: Transport.TCP,
				options: {
					host: envs.productsMicroserviceHost,
					port: envs.productsMicroservicePort,
				},
			},
		]),
	]
})
export class ProductsModule { }
