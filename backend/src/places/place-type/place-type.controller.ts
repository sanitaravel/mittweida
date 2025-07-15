import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PlaceTypeService } from './place-type.service';
import { PlaceType } from './place-type.model';

@ApiTags('place-types')
@Controller('place-types')
export class PlaceTypeController {
  constructor(private readonly placeTypeService: PlaceTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all place types' })
  @ApiResponse({
    status: 200,
    description: 'List of place types',
    type: [PlaceType],
  })
  getAllPlaceTypes() {
    return this.placeTypeService.getAllPlaceTypes();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new place type' })
  @ApiBody({
    schema: { type: 'object', properties: { name: { type: 'string' } } },
  })
  @ApiResponse({
    status: 201,
    description: 'Place type created',
    type: PlaceType,
  })
  addPlaceType(@Body('name') name: string) {
    return this.placeTypeService.addPlaceType(name);
  }
}
