import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),PassportModule.register({ session: false })],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
