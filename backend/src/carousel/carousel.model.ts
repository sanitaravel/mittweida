import { ApiProperty } from '@nestjs/swagger';

export class CarouselSlide {
  @ApiProperty({
    example: 'college-grounds',
    description: 'Key of the place this slide belongs to',
  })
  placeKey: string;

  @ApiProperty({
    example: 1,
    description: 'Order number of the slide for the place',
  })
  order: number;

  @ApiProperty({
    example: 'Welcome to College Grounds',
    description: 'Title of the carousel slide',
  })
  title: string;

  @ApiProperty({
    example: 'Discover the green campus',
    description: 'Text for the carousel slide',
  })
  text: string;

  @ApiProperty({
    example: '/images/college1.jpg',
    description: 'Image URL or path for the slide',
  })
  image: string;
}
