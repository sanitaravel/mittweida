import { PlaceTypeService } from './place-type.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PlaceTypeService', () => {
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
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add and get place types', () => {
    service.addPlaceType('Museum');
    service.addPlaceType('Gallery');
    const types = service.getAllPlaceTypes();
    expect(types.map((t) => t.name)).toEqual(
      expect.arrayContaining(['Museum', 'Gallery']),
    );
  });
});
