import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as parse from 'csv-parse/sync';
import { Route } from './route.model';
import { Feature } from '../features/feature.model';
import { Place } from '../places/place/place.model';

@Injectable()
export class RoutesService {
  private routesFile = path.resolve(__dirname, '../../data/routes.csv');
  private featuresFile = path.resolve(__dirname, '../../data/features.csv');
  private placesFile = path.resolve(__dirname, '../../data/places.csv');

  private readFeatures(): Feature[] {
    const data = fs.readFileSync(this.featuresFile, 'utf-8');
    const lines = data.trim().split('\n');
    const features: Feature[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [key, name] = lines[i].split(',');
      features.push({ key: key.trim(), name: name.trim() });
    }
    return features;
  }

  private readPlaces(): Place[] {
    const data = fs.readFileSync(this.placesFile, 'utf-8');
    const records = parse.parse(data, { columns: true, skip_empty_lines: true, trim: true });
    return records.map((row: any) => ({
      id: row.id.trim(),
      name: row.name.trim(),
      description: row.description.trim(),
      coordinates: row.coordinates.split(',').map(Number) as [number, number],
      type: { key: row.type.trim(), name: row.type.trim() },
      estimatedVisitTime: Number(row.estimatedVisitTime),
    }));
  }

  private readRoutes(): Route[] {
    const features = this.readFeatures();
    const places = this.readPlaces();
    const data = fs.readFileSync(this.routesFile, 'utf-8');
    const records = parse.parse(data, { columns: true, skip_empty_lines: true, trim: true });
    return records.map((row: any) => {
      const routeFeatures = row.features.split('|').map((key: string) => features.find(f => f.key === key.trim()) || { key: key.trim(), name: key.trim() });
      const routePlaces = row.places.split('|').map((id: string) => places.find(p => p.id === id.trim())).filter(Boolean);
      return {
        id: row.id.trim(),
        name: row.name.trim(),
        stops: Number(row.stops),
        features: routeFeatures,
        description: row.description.trim(),
        places: routePlaces,
      };
    });
  }

  getAll(): Route[] {
    return this.readRoutes();
  }

  getById(id: string): Route | undefined {
    return this.readRoutes().find(r => r.id === id);
  }
}
