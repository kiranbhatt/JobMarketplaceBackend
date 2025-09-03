import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealth(): string {
    return "Users Service is healthy!";
  }

  getUsers(): any[] {
    return [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ];
  }

  getUserById(id: number): any {
    const users = this.getUsers();
    return users.find((user) => user.id === id) || { error: "User not found" };
  }
}
