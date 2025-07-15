import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Feature } from './feature.model';

@Injectable()
export class FeaturesService {
  private featuresFile: string = path.resolve(
    __dirname,
    '../../data/features.csv',
  );

  // For tests only
  static withFile(filePath: string): FeaturesService {
    const instance = new FeaturesService();
    instance.featuresFile = filePath;
    return instance;
  }

  getAllFeatures(): Feature[] {
    const data = fs.readFileSync(this.featuresFile, 'utf-8');
    const lines = data.trim().split('\n');
    const result: Feature[] = [];
    for (let i = 1; i < lines.length; i++) {
      // skip header
      const [key, name] = lines[i].split(',');
      if (key && name) {
        result.push({ key: key.trim(), name: name.trim() });
      }
    }
    return result;
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  addFeature(name: string): Feature {
    const key = this.slugify(name);
    // Check if feature already exists
    const features = this.getAllFeatures();
    if (features.some((f) => f.key === key)) {
      throw new Error('Feature key already exists');
    }
    // Append to CSV
    fs.appendFileSync(this.featuresFile, `\n${key},${name}`);
    return { key, name };
  }
}
