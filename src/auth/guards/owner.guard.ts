import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private db: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private log: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userIdStr: string = request.user.sub;
    const userId: number = parseInt(userIdStr, 10);
    const productId: number = parseInt(request.params.id, 10);

    if (!productId || isNaN(productId)) {
      throw new BadRequestException('Valid product ID is required');
    }

    if (!userId || isNaN(userId)) {
      throw new ForbiddenException('Invalid user ID');
    }

    try {
      const product = await this.db.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          user_id: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.user_id !== userId) {
        this.log.warn(
          `access denied from productID: ${productId} to userID ${userId}`,
        );
        throw new ForbiddenException(
          'Access denied. You can only access your own products',
        );
      }

      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new ForbiddenException('Access denied due to server error');
    }
  }
}
