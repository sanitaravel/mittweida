import { Injectable, NotFoundException } from '@nestjs/common';
import { Place } from './place.model';
import * as fs from 'fs';
import * as path from 'path';
import * as parse from 'csv-parse/sync';
import { PlaceType } from '../place-type/place-type.model';

@Injectable()
export class PlaceService {
  private placesFile = path.resolve(__dirname, '../../../data/places.csv');
  private placeTypesFile = path.resolve(__dirname, '../../../data/place-types.csv');

  private readPlaceTypes(): PlaceType[] {
    const data = fs.readFileSync(this.placeTypesFile, 'utf-8');
    const lines = data.trim().split('\n');
    const types: PlaceType[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [key, name] = lines[i].split(',');
      types.push({ key: key.trim(), name: name.trim() });
    }
    return types;
  }

  private readPlaces(): Place[] {
    const types = this.readPlaceTypes();
    const data = fs.readFileSync(this.placesFile, 'utf-8');
    const records = parse.parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    const places: Place[] = records.map((row: any) => {
      const coords = row.coordinates.split(',').map(Number) as [number, number];
      const type = types.find(t => t.key === row.type.trim());
      return {
        id: row.id.trim(),
        name: row.name.trim(),
        description: row.description.trim(),
        coordinates: coords,
        type: type || { key: row.type.trim(), name: row.type.trim() },
        estimatedVisitTime: Number(row.estimatedVisitTime),
      };
    });
    return places;
  }

  getAll(): Place[] {
    return this.readPlaces();
  }

  getById(id: string): Place {
    const place = this.readPlaces().find(p => p.id === id);
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }
}
