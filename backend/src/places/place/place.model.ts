import { ApiProperty } from '@nestjs/swagger';
import { PlaceType } from '../place-type/place-type.model';

export class Place {
  @ApiProperty({ example: 'train-station', description: 'Unique place ID' })
  id: string;

  @ApiProperty({ example: 'Mittweida Train Station', description: 'Name of the place' })
  name: string;

  @ApiProperty({ example: 'Historic railway station, gateway to the city', description: 'Description of the place' })
  description: string;

  @ApiProperty({ example: [50.9874227359811, 12.960510479210734], description: 'Coordinates [lat, lng]' })
  coordinates: [number, number];

  @ApiProperty({ type: () => PlaceType, description: 'Type of the place' })
  type: PlaceType;

  @ApiProperty({ example: 10, description: 'Estimated visit time in minutes' })
  estimatedVisitTime: number;
}
