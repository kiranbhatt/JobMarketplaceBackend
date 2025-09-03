import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {
  formatResponse(data: any, success = true): any {
    return {
      success,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
