
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { Route } from './route.model';

describe('RoutesController', () => {
  let controller: RoutesController;
  let service: RoutesService;

  beforeEach(async () => {
    service = {
      getAll: jest.fn(),
      getById: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [{ provide: RoutesService, useValue: service }],
    }).compile();
    controller = module.get<RoutesController>(RoutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all routes', () => {
    const routes: Route[] = [
      { id: 'a', name: 'A', stops: 2, features: [], description: 'desc', places: [] },
      { id: 'b', name: 'B', stops: 3, features: [], description: 'desc', places: [] },
    ];
    (service.getAll as jest.Mock).mockReturnValue(routes);
    expect(controller.getAll()).toEqual(routes);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should return route by id', () => {
    const route: Route = { id: 'a', name: 'A', stops: 2, features: [], description: 'desc', places: [] };
    (service.getById as jest.Mock).mockReturnValue(route);
    expect(controller.getById('a')).toEqual(route);
    expect(service.getById).toHaveBeenCalledWith('a');
  });
});
