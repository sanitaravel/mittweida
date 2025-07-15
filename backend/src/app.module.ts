import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';
import { PlaceTypeModule } from './places/place-type/place-type.module';
import { CarouselModule } from './carousel/carousel.module';
import { PlaceModule } from './places/place/place.module';

@Module({
  imports: [FeaturesModule, PlaceTypeModule, CarouselModule, PlaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
