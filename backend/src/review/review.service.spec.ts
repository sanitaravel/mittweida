
import { ReviewService } from './review.service';
import * as fs from 'fs';
import * as path from 'path';
import { Review } from './review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  const testFile = path.resolve(__dirname, '../../data/reviews.test.csv');

  beforeEach(() => {
    service = new ReviewService();
    (service as any).reviewFile = testFile;
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  afterAll(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a valid review', () => {
    const review: Review = { routeId: 'r1', mark: 5, review: 'Great!' };
    const result = service.addReview(review);
    expect(result).toEqual(review);
    const fileContent = fs.readFileSync(testFile, 'utf-8');
    expect(fileContent).toContain('r1,5');
  });

  it('should reject invalid mark', () => {
    expect(() => service.addReview({ routeId: 'r1', mark: 0, review: 'Bad' })).toThrow();
    expect(() => service.addReview({ routeId: 'r1', mark: 6, review: 'Bad' })).toThrow();
  });

  it('should reject too long review', () => {
    const longReview = 'a'.repeat(501);
    expect(() => service.addReview({ routeId: 'r1', mark: 3, review: longReview })).toThrow();
  });
});
