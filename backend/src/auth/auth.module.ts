import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module'; // Import to access UserService
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // From .env
      signOptions: { expiresIn: '60m' }, // Tokens expire in 60 minutes
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // Export for use in other modules
})
export class AuthModule {}