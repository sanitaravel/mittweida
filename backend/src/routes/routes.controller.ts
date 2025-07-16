import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
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
  
  @Post()
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({ status: 201, type: Route })
  create(@Body() route: Route): Route {
    try {
      return this.routesService.create(route);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a route' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Route })
  update(@Param('id') id: string, @Body() update: Partial<Route>): Route {
    try {
      return this.routesService.update(id, update);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a route' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Boolean })
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.routesService.delete(id);
    if (!success) {
      throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
    }
    return { success };
  }
}
