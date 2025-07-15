
import { Test, TestingModule } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { Place } from './place.model';

describe('PlaceController', () => {
  let controller: PlaceController;
  let service: PlaceService;

  beforeEach(async () => {
    service = {
      getAll: jest.fn(),
      getById: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceController],
      providers: [{ provide: PlaceService, useValue: service }],
    }).compile();
    controller = module.get<PlaceController>(PlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all places', () => {
    const places: Place[] = [
      { id: 'a', name: 'A', description: 'desc', coordinates: [1,2], type: { key: 'landmark', name: 'Landmark' }, estimatedVisitTime: 10 },
      { id: 'b', name: 'B', description: 'desc', coordinates: [3,4], type: { key: 'park', name: 'Park' }, estimatedVisitTime: 20 },
    ];
    (service.getAll as jest.Mock).mockReturnValue(places);
    expect(controller.getAll()).toEqual(places);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should return place by id', () => {
    const place: Place = { id: 'a', name: 'A', description: 'desc', coordinates: [1,2], type: { key: 'landmark', name: 'Landmark' }, estimatedVisitTime: 10 };
    (service.getById as jest.Mock).mockReturnValue(place);
    expect(controller.getById('a')).toEqual(place);
    expect(service.getById).toHaveBeenCalledWith('a');
  });
});
