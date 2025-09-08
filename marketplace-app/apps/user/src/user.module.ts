import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/user/.env'], // Adjust as needed
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri =
          configService.get<string>('MONGO_URI_USER') ||
          'mongodb://localhost:27017/user-service';

        // ✅ Proper logging after env has been loaded
        console.log('✅ Loaded MONGO_URI_USER from .env:', mongoUri);
        console.log('Dot env : ', process.env.MONGO_URI_USER);

        return {
          uri: mongoUri,
          retryAttempts: 0,
          retryDelay: 0,
          autoCreate: false,
          connectionFactory: (connection) => {
            connection.on('error', (err) => {
              console.error('❌ MongoDB connection error:', err.message);
            });
            connection.on('disconnected', () => {
              console.warn('⚠️ MongoDB disconnected');
            });
            connection.on('connected', () => {
              console.log('✅ MongoDB connected');
            });
            return connection;
          },
        };
      },
    }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
