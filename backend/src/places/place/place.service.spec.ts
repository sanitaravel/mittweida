import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from './place.service';
import * as fs from 'fs';
import * as path from 'path';
import { Place } from './place.model';

describe('PlaceService', () => {
  let service: PlaceService;
  const testPlacesFile = path.resolve(
    __dirname,
    '../../../data/places.test.csv',
  );
  const testTypesFile = path.resolve(
    __dirname,
    '../../../data/place-types.test.csv',
  );

  beforeAll(() => {
    fs.writeFileSync(
      path.resolve(__dirname, '../../../data/place-types.test.csv'),
      'key,name\nlandmark,Landmark\npark,Park\n',
    );
  });

  beforeEach(() => {
    // Write a test CSV file with quoted description
    fs.writeFileSync(
      testPlacesFile,
      'id,name,description,coordinates,type,estimatedVisitTime\ntrain-station,Mittweida Train Station,"Historic railway station, gateway to the city","50.9874227359811,12.960510479210734",landmark,10\npark1,Park One,"A park, with trees","50.98845055261998,12.969007425797134",park,60\n',
    );
    service = new PlaceService();
    (service as any).placesFile = testPlacesFile;
    (service as any).placeTypesFile = testTypesFile;
  });

  afterAll(() => {
    fs.unlinkSync(testTypesFile);
    fs.unlinkSync(testPlacesFile);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read all places from CSV', () => {
    const places = service.getAll();
    expect(places.length).toBe(2);
    expect(places[0].id).toBe('train-station');
    expect(places[1].id).toBe('park1');
    expect(places[0].description).toContain('gateway to the city');
    expect(places[1].description).toContain('with trees');
  });

  it('should get place by id', () => {
    const place = service.getById('park1');
    expect(place.name).toBe('Park One');
    expect(place.type.key).toBe('park');
  });

  it('should throw if place not found', () => {
    expect(() => service.getById('not-exist')).toThrow();
  });
});
