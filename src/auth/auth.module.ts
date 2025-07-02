import { Global, Module } from '@nestjs/common';
import { JwtTokenService } from './jwt/jwtToken.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtTokenService, AuthGuard],
  exports: [JwtTokenService, AuthGuard],
})
export class AuthModule {}
