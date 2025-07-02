import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResponseApi } from 'src/model/response';
import {
  ProductCreate,
  ProductResponse,
  ProductUpdate,
} from './model/product.model';
import { OwnerGuard } from 'src/auth/guards/owner.guard';

@Controller('/api/products')
export class ProductController {
  constructor(
    private service: ProductService,
    @Inject(WINSTON_MODULE_PROVIDER) private log: Logger,
  ) {}

  @Post()
  @HttpCode(201)
  async inputProduct(
    @Body() request: ProductCreate,
    @Request() req,
  ): Promise<ResponseApi<ProductResponse>> {
    const userIdStr: string = req.user.sub;
    const userID: number = parseInt(userIdStr, 10);
    const result: ProductResponse = await this.service.create(request, userID);

    this.log.info('input new product success');
    return {
      status_code: 201,
      message: `insert new product successfully`,
      data: result,
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(OwnerGuard)
  async updateProduct(
    @Body() request: ProductUpdate,
    @Param('id') id: string,
  ): Promise<ResponseApi<ProductResponse>> {
    const productID: number = parseInt(id, 10);
    const result: ProductResponse = await this.service.update(
      request,
      productID,
    );

    this.log.info(`update product ${productID} are success`);
    return {
      status_code: 200,
      message: 'update product successfully',
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(OwnerGuard)
  async getProduct(
    @Param('id') id: string,
  ): Promise<ResponseApi<ProductResponse>> {
    const productID: number = parseInt(id, 10);
    const result: ProductResponse = await this.service.getProduct(productID);

    this.log.info(`get product ${productID} are success`);
    return {
      status_code: 200,
      message: 'get product successfully',
      data: result,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(OwnerGuard)
  async deleteProduct(@Param('id') id: string): Promise<ResponseApi<string>> {
    const productID: number = parseInt(id, 10);
    const result: string = await this.service.delete(productID);

    this.log.info(`delete product ${productID} are success`);
    return {
      status_code: 200,
      message: 'delete product successfully',
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getProducts(@Request() req): Promise<ResponseApi<ProductResponse[]>> {
    const userIdStr: string = req.user.sub;
    const userID: number = parseInt(userIdStr, 10);
    const result: ProductResponse[] = await this.service.getProducts(userID);

    this.log.info(`get products by user ${userID} are success`);
    return {
      status_code: 200,
      message: 'get products successfully',
      data: result,
    };
  }
}
