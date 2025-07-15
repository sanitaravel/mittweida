import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({ example: 'historic-center', description: 'Route ID being reviewed' })
  routeId: string;

  @ApiProperty({ example: 5, description: 'Mark (1-5)' })
  mark: number;

  @ApiProperty({ example: 'Great route!', maxLength: 500, description: 'User review, max 500 symbols' })
  review: string;
}
