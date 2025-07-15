import { ApiProperty } from '@nestjs/swagger';

export class Feature {
  @ApiProperty({ example: 'parks', description: 'Unique slug key for the feature' })
  key: string;

  @ApiProperty({ example: 'Parks', description: 'Human-readable name of the feature' })
  name: string;
}
