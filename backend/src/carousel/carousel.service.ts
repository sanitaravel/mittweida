import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
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
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];
    const result: CarouselSlide[] = records
      .filter((row: any) => row.placeKey === placeKey)
      .map((row: any, idx: number) => ({
        placeKey: row.placeKey,
        title: row.title,
        text: row.text,
        image: row.image,
        order: row.order ? Number(row.order) : idx + 1,
      }));
    result.sort((a, b) => a.order - b.order);
    return result;
  }

  addSlide(slide: CarouselSlide): CarouselSlide {
    // Find current max order for this placeKey
    const data = fs.readFileSync(this.carouselFile, 'utf-8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];
    let maxOrder = 0;
    for (const row of records) {
      if (
        row.placeKey === slide.placeKey &&
        row.order &&
        !isNaN(Number(row.order))
      ) {
        maxOrder = Math.max(maxOrder, Number(row.order));
      }
    }
    const newOrder = maxOrder + 1;
    // Escape fields with commas by wrapping in double quotes
    const escapeCsv = (val: string) => {
      if (val.includes(',')) return `"${val.replace(/"/g, '""')}"`;
      return val;
    };
    // Ensure image path is /images/[filename]
    let imagePath = slide.image;
    if (imagePath) {
      const filename = path.basename(imagePath);
      imagePath = `/images/${filename}`;
    }
    const line = [
      escapeCsv(slide.placeKey),
      escapeCsv(slide.title),
      escapeCsv(slide.text),
      escapeCsv(imagePath),
      newOrder,
    ].join(',');
    fs.appendFileSync(this.carouselFile, `\n${line}`);
    return { ...slide, image: imagePath, order: newOrder };
  }

  getSlidesByPlaceKey(placeKey: string): CarouselSlide[] {
    const data = fs.readFileSync(this.carouselFile, 'utf-8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];
    const slides: CarouselSlide[] = records
      .filter((row: any) => row.placeKey === placeKey)
      .map((row: any, idx: number) => ({
        placeKey: row.placeKey,
        title: row.title,
        text: row.text,
        image: row.image,
        order: row.order ? Number(row.order) : idx + 1,
      }));
    slides.sort((a, b) => a.order - b.order);
    return slides;
  }
}
