import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../../libs/common/src/schemas/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config accessible app-wide
      envFilePath: ".env", // path to your environment file
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ""),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
