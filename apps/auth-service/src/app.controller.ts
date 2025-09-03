import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @(MessagePattern({ cmd: 'auth_health' }) as any)
  getHealth(): string {
    return this.appService.getHealth();
  }

  @(MessagePattern({ cmd: 'auth_validate' }) as any)
  validateToken(data: any): any {
    return this.appService.validateToken(data);
  }
}
