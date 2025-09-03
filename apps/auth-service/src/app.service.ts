import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return 'Auth Service is healthy!';
  }

  validateToken(data: any): any {
    return { 
      valid: true, 
      userId: '123', 
      username: data.username 
    };
  }
}
