import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';

@Module({
  providers: [CarouselService],
  controllers: [CarouselController]
})
export class CarouselModule {}
