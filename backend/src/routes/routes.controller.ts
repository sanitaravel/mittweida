import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { Route } from './route.model';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 200, type: Route, isArray: true })
  getAll(): Route[] {
    return this.routesService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Route })
  getById(@Param('id') id: string): Route | undefined {
    return this.routesService.getById(id);
  }
}
