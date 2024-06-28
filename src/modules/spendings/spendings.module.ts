import { Module } from '@nestjs/common';
import { SpendingsController } from './spendings.controller';
import { SpendingsService } from './spendings.service';
import { SpendingRepository } from './spending.repository';

@Module({
  controllers: [SpendingsController],
  providers: [SpendingsService,SpendingRepository]
})
export class SpendingsModule {}
