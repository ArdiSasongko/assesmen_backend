import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from './jwt/jwtToken.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtservice: JwtTokenService) {}

  use(req: any, res: any, next: (error?: any) => void) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('token required');
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtservice.verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
