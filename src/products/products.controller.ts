import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
	constructor(
		@Inject(NATS_SERVICE) private readonly client: ClientProxy
	) { }

	@Post()
	createProduct(@Body() createProductDto: CreateProductDto) {
		return this.client.send({ cmd: 'create_product' }, createProductDto);
	}

	@Get()
	getAllProducts(@Query() paginationDto: PaginationDto) {
		return this.client.send({ cmd: 'get_all_products' }, paginationDto);
	}

	@Get(':id')
	getOneProduct(@Param('id') id: string) {

		return this.client.send({ cmd: 'get_one_product' }, { id })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)

		//? Usando firstValueFrom para obtener el primer valor de un observable
		// try {

		// 	const product = await firstValueFrom(
		// 		this.productsClient.send({ cmd: 'get_one_product' }, { id }));

		// 	return product;

		// } catch (error) {

		// 	throw new RpcException(error);
		// }
		//? Usando firstValueFrom para obtener el primer valor de un observable
	}

	@Patch(':id')
	updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
		return this.client.send({ cmd: 'update_product' }, {
			id,
			...updateProductDto
		}).pipe(
			catchError(error => { throw new RpcException(error) }
			));
	}

	@Delete(':id')
	deleteProduct(@Param('id', ParseIntPipe) id: number) {
		return this.client.send({ cmd: 'delete_product' }, { id })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}
}
