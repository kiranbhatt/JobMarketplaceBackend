import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @(MessagePattern({ cmd: "users_health" }) as any)
  getHealth(): Promise<string> {
    return Promise.resolve(this.appService.getHealth());
  }

  @(MessagePattern({ cmd: "users_get" }) as any)
  getUsers(): Promise<any[]> {
    return Promise.resolve(this.appService.getUsers());
  }

  @(MessagePattern({ cmd: "users_get_by_id" }) as any)
  getUserById(data: any): Promise<any> {
    return Promise.resolve(this.appService.getUserById(data.id));
  }
}
