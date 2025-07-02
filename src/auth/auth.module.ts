import { Global, Module } from '@nestjs/common';
import { JwtTokenService } from './jwt/jwtToken.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './auth.middleware';
import { OwnerGuard } from './guards/owner.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtTokenService, OwnerGuard, AuthMiddleware],
  exports: [JwtTokenService, OwnerGuard, AuthMiddleware],
})
export class AuthModule {}
