import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  // console.log('Loaded MONGO_URI_USER:', process.env.MONGO_URI_USER);
  const app = await NestFactory.create(UserModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
