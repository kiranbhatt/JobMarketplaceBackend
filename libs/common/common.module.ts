import { Module } from "@nestjs/common";
import { CommonService } from "../common/src/services/common.service";

@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
