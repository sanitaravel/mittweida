import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CarouselSlide } from './carousel.model';

@Injectable()
export class CarouselService {
  private carouselFile: string = path.resolve(
    __dirname,
    '../../data/carousel.csv',
  );

  static withFile(filePath: string): CarouselService {
    const instance = new CarouselService();
    (instance as any).carouselFile = filePath;
    return instance;
  }

  getSlidesForPlace(placeKey: string): CarouselSlide[] {
    const data = fs.readFileSync(this.carouselFile, 'utf-8');
    const lines = data.trim().split('\n');
    const result: CarouselSlide[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [key, title, text, image, order] = lines[i].split(',');
      if (key && key.trim() === placeKey) {
        result.push({
          placeKey: key.trim(),
          title: title.trim(),
          text: text.trim(),
          image: image.trim(),
          order: order ? Number(order) : i,
        });
      }
    }
    result.sort((a, b) => a.order - b.order);
    return result;
  }

  addSlide(slide: CarouselSlide): CarouselSlide {
    // Find current max order for this placeKey
    const data = fs.readFileSync(this.carouselFile, 'utf-8');
    const lines = data.trim().split('\n');
    let maxOrder = 0;
    for (let i = 1; i < lines.length; i++) {
      const [key, , , , order] = lines[i].split(',');
      if (key.trim() === slide.placeKey && order && !isNaN(Number(order))) {
        maxOrder = Math.max(maxOrder, Number(order));
      }
    }
    const newOrder = maxOrder + 1;
    const line = [slide.placeKey, slide.title, slide.text, slide.image, newOrder].join(',');
    fs.appendFileSync(this.carouselFile, `\n${line}`);
    return { ...slide, order: newOrder };
  }
  
  getSlidesByPlaceKey(placeKey: string): CarouselSlide[] {
    const data = fs.readFileSync(this.carouselFile, 'utf-8');
    const lines = data.trim().split('\n');
    const slides: CarouselSlide[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [key, title, text, image, order] = lines[i].split(',');
      if (key.trim() === placeKey) {
        slides.push({
          placeKey: key.trim(),
          title: title.trim(),
          text: text.trim(),
          image: image.trim(),
          order: order ? Number(order) : i,
        });
      }
    }
    slides.sort((a, b) => a.order - b.order);
    return slides;
  }
}
