import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';
import { PlaceTypeService } from './places/place-type/place-type.service';
import { PlaceTypeController } from './places/place-type/place-type.controller';
import { PlaceTypeModule } from './places/place-type/place-type.module';
import { CarouselModule } from './carousel/carousel.module';

@Module({
  imports: [FeaturesModule, PlaceTypeModule, CarouselModule],
  controllers: [AppController, PlaceTypeController],
  providers: [AppService, PlaceTypeService],
})
export class AppModule {}
