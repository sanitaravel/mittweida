import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';
import { PlaceTypeModule } from './places/place-type/place-type.module';
import { CarouselModule } from './carousel/carousel.module';
import { PlaceModule } from './places/place/place.module';
import { RoutesModule } from './routes/routes.module';
import { ReviewModule } from './review/review.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    FeaturesModule,
    PlaceTypeModule,
    CarouselModule,
    PlaceModule,
    RoutesModule,
    ReviewModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'data', 'images'),
      serveRoot: '/images', // API path prefix
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
