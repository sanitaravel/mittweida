import { ApiProperty } from '@nestjs/swagger';

export class PlaceType {
  @ApiProperty({
    example: 'landmark',
    description: 'Unique slug key for the place type',
  })
  key: string;

  @ApiProperty({
    example: 'Landmark',
    description: 'Human-readable name of the place type',
  })
  name: string;
}
