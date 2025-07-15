import { Controller, Get, Param } from '@nestjs/common';
import { PlaceService } from './place.service';
import { Place } from './place.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all places' })
  @ApiResponse({ status: 200, type: Place, isArray: true })
  getAll(): Place[] {
    return this.placeService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get place by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Place })
  getById(@Param('id') id: string): Place {
    return this.placeService.getById(id);
  }
}
