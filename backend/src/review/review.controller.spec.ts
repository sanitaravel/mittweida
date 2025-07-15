
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './review.model';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  beforeEach(async () => {
    service = {
      addReview: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [{ provide: ReviewService, useValue: service }],
    }).compile();
    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a review', () => {
    const review: Review = { routeId: 'r1', mark: 5, review: 'Great!' };
    (service.addReview as jest.Mock).mockReturnValue(review);
    expect(controller.addReview(review)).toEqual(review);
    expect(service.addReview).toHaveBeenCalledWith(review);
  });
});
