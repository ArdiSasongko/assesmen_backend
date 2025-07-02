import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import {
  ProductCreate,
  ProductResponse,
  ProductUpdate,
} from './model/product.model';
import { ProductValidation } from './model/product.validation';
@Injectable()
export class ProductService {
  constructor(
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private log: Logger,
    private db: PrismaService,
  ) {}

  async create(
    request: ProductCreate,
    userID: number,
  ): Promise<ProductResponse> {
    this.log.info('create product process');

    const createProduct: ProductCreate = this.validation.validate(
      ProductValidation.createProduct,
      request,
    );

    const exists: number = await this.db.product.count({
      where: {
        name: createProduct.name,
      },
    });

    if (exists !== 0) {
      this.log.warn(`failed: username '${createProduct.name}' already exists`);
      throw new HttpException('Username already exists', 400);
    }

    try {
      const product = await this.db.product.create({
        data: {
          user_id: userID,
          name: createProduct.name,
          description: createProduct.description,
          price: createProduct.price,
          created_at: new Date().toISOString(),
        },
      });

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
      };
    } catch (error) {
      this.log.error('failed to insert new product to database', error);
      throw new HttpException('failed to insert new product', 500);
    }
  }

  async update(
    request: ProductUpdate,
    productID: number,
  ): Promise<ProductResponse> {
    this.log.info('update product process');

    if (productID === undefined || isNaN(productID)) {
      throw new BadRequestException('Valid product ID is required');
    }

    const updateProduct: ProductUpdate = this.validation.validate(
      ProductValidation.updateProduct,
      request,
    );

    const currentProduct = await this.db.product.findFirst({
      where: {
        id: productID,
      },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        price: true,
      },
    });

    if (!currentProduct) {
      this.log.warn(`product with id ${productID} not found`);
      throw new NotFoundException('Product not found');
    }

    try {
      const updateData = {
        name: updateProduct.name || currentProduct.name,
        description: updateProduct.description || currentProduct.description,
        price:
          updateProduct.price !== undefined
            ? updateProduct.price
            : currentProduct.price,
        updated_at: new Date(),
      };

      const updatedProduct = await this.db.product.update({
        where: {
          id: productID,
        },
        data: updateData,
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      return {
        id: updatedProduct.id,
        owner: updatedProduct.user.username,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        updated_at: updateData.updated_at,
      };
    } catch (error) {
      this.log.error('Failed to update product', error);
      throw new HttpException('Failed to update product', 500);
    }
  }

  async delete(productID: number): Promise<string> {
    this.log.info('delete product process');

    if (productID === undefined || isNaN(productID)) {
      throw new BadRequestException('Valid product ID is required');
    }

    const currentProduct = await this.db.product.findFirst({
      where: {
        id: productID,
      },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        price: true,
      },
    });

    if (!currentProduct) {
      this.log.warn(`product with id ${productID} not found`);
      throw new NotFoundException('Product not found');
    }

    try {
      await this.db.product.delete({
        where: {
          id: productID,
        },
      });

      return `Product '${currentProduct.name}' deleted successfully`;
    } catch (error) {
      this.log.error('Failed to delete product', error);
      throw new HttpException('Failed to delete product', 500);
    }
  }

  async getProduct(productID: number): Promise<ProductResponse> {
    if (productID === undefined || isNaN(productID)) {
      throw new BadRequestException('Valid product ID is required');
    }

    try {
      const result = await this.db.product.findFirst({
        where: {
          id: productID,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      return {
        id: result?.id,
        owner: result?.user.username,
        name: result?.name,
        description: result?.description,
        price: result?.price,
        created_at: result?.created_at,
        updated_at: result?.updated_at,
      };
    } catch (error) {
      this.log.error(`Failed to get product with ${productID}`, error);
      throw new HttpException('Failed to get product', 500);
    }
  }

  async getProducts(userID: number): Promise<ProductResponse[]> {
    try {
      const result = await this.db.product.findMany({
        where: {
          user_id: userID,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return result.map((res) => ({
        id: res.id,
        name: res.name,
        description: res.description,
        price: res.price,
      }));
    } catch (error) {
      this.log.error(`Failed to get products `, error);
      throw new HttpException('Failed to get products', 500);
    }
  }
}
