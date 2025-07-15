import { PlaceTypeController } from './place-type.controller';
import { PlaceTypeService } from './place-type.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PlaceTypeController', () => {
  let controller: PlaceTypeController;
  let service: PlaceTypeService;
  let tempFile: string;

  beforeEach(() => {
    const originalFile = path.resolve(
      __dirname,
      '../../../data/place-types.csv',
    );
    tempFile = path.resolve(__dirname, '../../../data/place-types.test.csv');
    fs.copyFileSync(originalFile, tempFile);
    service = PlaceTypeService.withFile(tempFile);
    controller = new PlaceTypeController(service);
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add and get place types via controller', () => {
    controller.addPlaceType('Museum');
    controller.addPlaceType('Gallery');
    const types = controller.getAllPlaceTypes();
    expect(types.map((t) => t.name)).toEqual(
      expect.arrayContaining(['Museum', 'Gallery']),
    );
  });
});
