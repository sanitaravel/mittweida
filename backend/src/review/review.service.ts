import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Review } from './review.model';

@Injectable()
export class ReviewService {
  private reviewFile = path.resolve(__dirname, '../../data/reviews.csv');

  addReview(review: Review): Review {
    if (review.mark < 1 || review.mark > 5) {
      throw new BadRequestException('Mark must be between 1 and 5');
    }
    if (review.review.length > 500) {
      throw new BadRequestException('Review must be at most 500 characters');
    }
    if (!fs.existsSync(this.reviewFile)) {
      fs.writeFileSync(this.reviewFile, 'routeId,mark,review\n');
    }
    const line = [review.routeId, review.mark, JSON.stringify(review.review)].join(',');
    fs.appendFileSync(this.reviewFile, `\n${line}`);
    return review;
  }
}
