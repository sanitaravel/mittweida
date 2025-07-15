import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FeaturesService } from './features.service';
import { Feature } from './feature.model';

@ApiTags('features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all features' })
  @ApiResponse({
    status: 200,
    description: 'List of features',
    type: [Feature],
  })
  getAllFeatures() {
    return this.featuresService.getAllFeatures();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new feature' })
  @ApiBody({
    schema: { type: 'object', properties: { name: { type: 'string' } } },
  })
  @ApiResponse({ status: 201, description: 'Feature created', type: Feature })
  addFeature(@Body('name') name: string) {
    return this.featuresService.addFeature(name);
  }
}
