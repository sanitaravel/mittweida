
import { Test, TestingModule } from '@nestjs/testing';
import { CarouselController } from './carousel.controller';
import { CarouselService } from './carousel.service';
import { CarouselSlide } from './carousel.model';

describe('CarouselController', () => {
  let controller: CarouselController;
  let service: CarouselService;

  beforeEach(async () => {
    service = {
      getSlidesByPlaceKey: jest.fn(),
      addSlide: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarouselController],
      providers: [{ provide: CarouselService, useValue: service }],
    }).compile();
    controller = module.get<CarouselController>(CarouselController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return slides for a placeKey', () => {
    const slides: CarouselSlide[] = [
      { placeKey: 'test', title: 'A', text: 'A', image: '/img/a.jpg', order: 1 },
      { placeKey: 'test', title: 'B', text: 'B', image: '/img/b.jpg', order: 2 },
    ];
    (service.getSlidesByPlaceKey as jest.Mock).mockReturnValue(slides);
    const result = controller.getSlidesByPlaceKey('test');
    expect(result).toEqual(slides);
    expect(service.getSlidesByPlaceKey).toHaveBeenCalledWith('test');
  });

  it('should add a slide with image', async () => {
    const slide: CarouselSlide = { placeKey: 'test', title: 'A', text: 'A', image: '/img/a.jpg', order: 1 };
    (service.addSlide as jest.Mock).mockReturnValue(slide);
    const file = { filename: 'a.jpg' } as any;
    const result = await controller.addSlideWithImage(file, 'test', 'A', 'A');
    expect(result).toEqual(slide);
    expect(service.addSlide).toHaveBeenCalled();
  });
});
