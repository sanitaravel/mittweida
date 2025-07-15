
import { RoutesService } from './routes.service';
import * as fs from 'fs';
import * as path from 'path';
import { Route } from './route.model';

describe('RoutesService', () => {
  let service: RoutesService;
  const testRoutesFile = path.resolve(__dirname, '../../data/routes.test.csv');
  const testFeaturesFile = path.resolve(__dirname, '../../data/features.test.csv');
  const testPlacesFile = path.resolve(__dirname, '../../data/places.test.csv');

  beforeAll(() => {
    // Write test features file
    fs.writeFileSync(testFeaturesFile, 'key,name\nhistorical,Historical\narchitecture,Architecture\nwalking,Walking\n');
    // Write test places file
    fs.writeFileSync(testPlacesFile, 'id,name,description,coordinates,type,estimatedVisitTime\ntrain-station,Train Station,"Desc","50.1,12.1",landmark,10\ncollege,College,"Desc","50.2,12.2",landmark,20\n');
  });

  beforeEach(() => {
    // Write a test CSV file
    fs.writeFileSync(testRoutesFile, 'id,name,stops,features,description,places\nhistoric-center,Historic City Center,2,"historical|architecture","Desc","train-station|college"\n');
    service = new RoutesService();
    (service as any).routesFile = testRoutesFile;
    (service as any).featuresFile = testFeaturesFile;
    (service as any).placesFile = testPlacesFile;
  });

  afterAll(() => {
    fs.unlinkSync(testFeaturesFile);
    fs.unlinkSync(testPlacesFile);
    fs.unlinkSync(testRoutesFile);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read all routes from CSV', () => {
    const routes = service.getAll();
    expect(routes.length).toBe(1);
    expect(routes[0].id).toBe('historic-center');
    expect(routes[0].features[0].key).toBe('historical');
    expect(routes[0].places[0].id).toBe('train-station');
  });

  it('should get route by id', () => {
    const route = service.getById('historic-center');
    expect(route?.name).toBe('Historic City Center');
  });

  it('should return undefined for missing route', () => {
    expect(service.getById('not-exist')).toBeUndefined();
  });
});
