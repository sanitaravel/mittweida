import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { Review } from './review.model';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a review for a route' })
  @ApiBody({ type: Review })
  @ApiResponse({ status: 201, type: Review })
  addReview(@Body() review: Review): Review {
    return this.reviewService.addReview(review);
  }
}
