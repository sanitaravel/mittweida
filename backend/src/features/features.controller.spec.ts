import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import * as fs from 'fs';
import * as path from 'path';

describe('FeaturesController', () => {
  let controller: FeaturesController;
  let service: FeaturesService;
  let tempFile: string;

  beforeEach(() => {
    const originalFile = path.resolve(__dirname, '../../data/features.csv');
    tempFile = path.resolve(__dirname, '../../data/features.test.csv');
    fs.copyFileSync(originalFile, tempFile);
    service = FeaturesService.withFile(tempFile);
    controller = new FeaturesController(service);
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add and get features via controller', () => {
    controller.addFeature('Walking');
    controller.addFeature('Architecture');
    const features = controller.getAllFeatures();
    expect(features.map((f) => f.name)).toEqual(
      expect.arrayContaining(['Walking', 'Architecture']),
    );
  });
});
