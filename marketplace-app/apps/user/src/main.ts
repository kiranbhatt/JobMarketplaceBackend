import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
