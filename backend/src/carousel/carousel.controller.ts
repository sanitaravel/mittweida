import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CarouselService } from './carousel.service';
import { CarouselSlide } from './carousel.model';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('carousel')
@ApiExtraModels(CarouselSlide)
@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Add a new carousel slide with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        placeKey: { type: 'string' },
        title: { type: 'string' },
        text: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.resolve(__dirname, '../../data/images'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async addSlideWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('placeKey') placeKey: string,
    @Body('title') title: string,
    @Body('text') text: string,
  ) {
    const imagePath = `/data/images/${file.filename}`;
    const slide: CarouselSlide = { placeKey, title, text, image: imagePath };
    return this.carouselService.addSlide(slide);
  }
}
