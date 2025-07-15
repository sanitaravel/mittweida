import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PlaceType } from './place-type.model';

@Injectable()
export class PlaceTypeService {
  private placeTypesFile: string = path.resolve(
    __dirname,
    '../../../data/place-types.csv',
  );

  static withFile(filePath: string): PlaceTypeService {
    const instance = new PlaceTypeService();
    (instance as any).placeTypesFile = filePath;
    return instance;
  }

  getAllPlaceTypes(): PlaceType[] {
    const data = fs.readFileSync(this.placeTypesFile, 'utf-8');
    const lines = data.trim().split('\n');
    const result: PlaceType[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [key, name] = lines[i].split(',');
      if (key && name) {
        result.push({ key: key.trim(), name: name.trim() });
      }
    }
    return result;
  }

  addPlaceType(name: string): PlaceType {
    const key = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const types = this.getAllPlaceTypes();
    if (types.some((t) => t.key === key)) {
      throw new Error('Place type key already exists');
    }
    fs.appendFileSync(this.placeTypesFile, `\n${key},${name}`);
    return { key, name };
  }
}
