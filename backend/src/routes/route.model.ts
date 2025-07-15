import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../places/place/place.model';
import { Feature } from '../features/feature.model';

export class Route {
  @ApiProperty({ example: 'historic-center', description: 'Unique route ID' })
  id: string;

  @ApiProperty({ example: 'Historic City Center', description: 'Name of the route' })
  name: string;

  @ApiProperty({ example: 4, description: 'Number of stops in the route' })
  stops: number;

  @ApiProperty({ type: [Feature], description: 'Features of the route' })
  features: Feature[];


  @ApiProperty({ example: 'Explore the charming historic center of Mittweida...', description: 'Description of the route' })
  description: string;

  @ApiProperty({ type: [Place], description: 'List of places in the route' })
  places: Place[];
}
