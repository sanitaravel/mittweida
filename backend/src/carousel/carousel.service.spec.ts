
import { Test, TestingModule } from '@nestjs/testing';
import { CarouselService } from './carousel.service';
import * as fs from 'fs';
import * as path from 'path';
import { CarouselSlide } from './carousel.model';

describe('CarouselService', () => {
  let service: CarouselService;
  const testFile = path.resolve(__dirname, '../../data/carousel.test.csv');

  beforeEach(() => {
    // Write a test CSV file
    fs.writeFileSync(testFile, 'placeKey,title,text,image,order\n');
    service = CarouselService.withFile(testFile);
  });

  afterEach(() => {
    fs.unlinkSync(testFile);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a slide and assign order', () => {
    const slide: CarouselSlide = {
      placeKey: 'test-place',
      title: 'Test Slide',
      text: 'Test Text',
      image: '/images/test.jpg',
      order: 1,
    };
    const result = service.addSlide(slide);
    expect(result.order).toBe(1);
    const slides = service.getSlidesByPlaceKey('test-place');
    expect(slides.length).toBe(1);
    expect(slides[0].title).toBe('Test Slide');
    expect(slides[0].order).toBe(1);
  });

  it('should increment order for multiple slides', () => {
    service.addSlide({ placeKey: 'test-place', title: 'A', text: 'A', image: '/img/a.jpg', order: 1 });
    service.addSlide({ placeKey: 'test-place', title: 'B', text: 'B', image: '/img/b.jpg', order: 1 });
    const slides = service.getSlidesByPlaceKey('test-place');
    expect(slides.length).toBe(2);
    expect(slides[0].order).toBe(1);
    expect(slides[1].order).toBe(2);
  });

  it('should sort slides by order', () => {
    service.addSlide({ placeKey: 'test-place', title: 'A', text: 'A', image: '/img/a.jpg', order: 1 });
    service.addSlide({ placeKey: 'test-place', title: 'B', text: 'B', image: '/img/b.jpg', order: 1 });
    const slides = service.getSlidesByPlaceKey('test-place');
    expect(slides[0].order).toBeLessThan(slides[1].order);
  });
});
