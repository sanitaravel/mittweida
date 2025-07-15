import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  exports: [PlaceService],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
