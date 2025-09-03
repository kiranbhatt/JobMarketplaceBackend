export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface MicroserviceConfig {
  transport: any;
  options: {
    host: string;
    port: number;
  };
}
