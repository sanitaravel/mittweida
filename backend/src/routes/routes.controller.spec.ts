
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
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  it('should create a route', () => {
    const route: Route = { id: 'c', name: 'C', stops: 1, features: [], description: 'desc', places: [] };
    (service.create as jest.Mock).mockReturnValue(route);
    expect(controller.create(route)).toEqual(route);
    expect(service.create).toHaveBeenCalledWith(route);
  });

  it('should throw on create error', () => {
    (service.create as jest.Mock).mockImplementation(() => { throw new Error('fail'); });
    expect(() => controller.create({} as any)).toThrow('fail');
  });

  it('should update a route', () => {
    const updated: Route = { id: 'd', name: 'D', stops: 2, features: [], description: 'desc', places: [] };
    (service.update as jest.Mock).mockReturnValue(updated);
    expect(controller.update('d', { name: 'D' })).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith('d', { name: 'D' });
  });

  it('should throw on update error', () => {
    (service.update as jest.Mock).mockImplementation(() => { throw new Error('not found'); });
    expect(() => controller.update('x', { name: 'X' })).toThrow('not found');
  });

  it('should delete a route', () => {
    (service.delete as jest.Mock).mockReturnValue(true);
    expect(controller.delete('z')).toEqual({ success: true });
    expect(service.delete).toHaveBeenCalledWith('z');
  });

  it('should throw on delete error', () => {
    (service.delete as jest.Mock).mockReturnValue(false);
    expect(() => controller.delete('not-exist')).toThrow('Route not found');
  });
});
