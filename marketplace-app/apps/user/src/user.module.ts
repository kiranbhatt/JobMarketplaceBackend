import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/user-service',
        // prevent service crash if DB is down
        retryAttempts: 0,      // don’t keep retrying forever
        retryDelay: 0,         // no delay
        autoCreate: false,     // don’t auto-create collections on startup
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
      }),
    }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
