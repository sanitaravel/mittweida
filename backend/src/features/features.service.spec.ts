import { FeaturesService } from './features.service';
import * as fs from 'fs';
import * as path from 'path';

describe('FeaturesService', () => {
  let service: FeaturesService;
  let tempFile: string;

  beforeEach(() => {
    const originalFile = path.resolve(__dirname, '../../data/features.csv');
    tempFile = path.resolve(__dirname, '../../data/features.test.csv');
    fs.copyFileSync(originalFile, tempFile);
    service = FeaturesService.withFile(tempFile);
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add and get features', () => {
    service.addFeature('Nature');
    service.addFeature('Sports');
    const features = service.getAllFeatures();
    expect(features.map((f) => f.name)).toEqual(
      expect.arrayContaining(['Nature', 'Sports']),
    );
  });
});
