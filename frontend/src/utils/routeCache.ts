import L from "leaflet";

export interface CachedRoute {
  data: {
    name: string;
    coordinates: Array<{ lat: number; lng: number }>; // Serializable coordinate format
    instructions: any[];
    summary: {
      totalDistance: number;
      totalTime: number;
    };
  };
  timestamp: number;
  waypoints: L.LatLng[];
}

export interface RouteCacheConfig {
  maxAge: number; // Cache expiration time in milliseconds
  maxEntries: number; // Maximum number of cached routes
  storageType: 'memory' | 'localStorage';
}

const DEFAULT_CONFIG: RouteCacheConfig = {
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxEntries: 100,
  storageType: 'localStorage'
};

class RouteCache {
  private config: RouteCacheConfig;
  private memoryCache: Map<string, CachedRoute> = new Map();

  constructor(config: Partial<RouteCacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Generate a cache key from waypoints
  private generateCacheKey(waypoints: L.LatLng[]): string {
    console.log('[RouteCache] Generating cache key for waypoints:', {
      waypointCount: waypoints.length,
      waypoints: waypoints.map((wp, index) => ({
        index,
        wp,
        hasLat: wp && typeof wp.lat !== 'undefined',
        hasLng: wp && typeof wp.lng !== 'undefined',
        lat: wp?.lat,
        lng: wp?.lng
      }))
    });

    // Validate waypoints and filter out invalid ones
    const validWaypoints = waypoints.filter((wp, index) => {
      if (!wp) {
        console.warn('[RouteCache] Waypoint at index', index, 'is null/undefined');
        return false;
      }
      if (typeof wp.lat === 'undefined' || typeof wp.lng === 'undefined') {
        console.warn('[RouteCache] Waypoint at index', index, 'missing lat/lng:', wp);
        return false;
      }
      if (typeof wp.lat !== 'number' || typeof wp.lng !== 'number') {
        console.warn('[RouteCache] Waypoint at index', index, 'has non-numeric lat/lng:', wp);
        return false;
      }
      return true;
    });

    if (validWaypoints.length !== waypoints.length) {
      console.warn('[RouteCache] Filtered out invalid waypoints:', {
        original: waypoints.length,
        valid: validWaypoints.length
      });
    }

    const coordinates = validWaypoints.map(wp => `${wp.lat.toFixed(6)},${wp.lng.toFixed(6)}`);
    const key = `route_${coordinates.join('|')}`;
    
    console.log('[RouteCache] Generated cache key:', {
      key,
      coordinateCount: coordinates.length
    });
    
    return key;
  }

  // Check if cached data is still valid
  private isValid(cachedRoute: CachedRoute): boolean {
    const now = Date.now();
    return (now - cachedRoute.timestamp) < this.config.maxAge;
  }

  // Get cached route data - now accepts both route ID strings and waypoint arrays
  get(key: string | L.LatLng[]): any | null {
    console.log('[RouteCache] Cache get request:', {
      keyType: typeof key,
      isString: typeof key === 'string',
      key: typeof key === 'string' ? key : `waypoints(${key.length})`,
      ...(typeof key !== 'string' && {
        waypointCount: key.length,
        waypoints: key.map((wp, index) => ({
          index,
          hasLat: wp && typeof wp.lat !== 'undefined',
          hasLng: wp && typeof wp.lng !== 'undefined',
          lat: wp?.lat,
          lng: wp?.lng
        }))
      })
    });

    let cacheKey: string;
    let waypoints: L.LatLng[] | null = null;

    if (typeof key === 'string') {
      // Route ID based caching
      cacheKey = `route_id_${key}`;
      console.log('[RouteCache] Using route ID cache key:', cacheKey);
    } else {
      // Waypoint-based caching (fallback)
      waypoints = key;
      if (waypoints.length < 2) {
        console.log('[RouteCache] Insufficient waypoints for caching');
        return null;
      }

      // Validate waypoints before processing
      const hasInvalidWaypoints = waypoints.some(wp => 
        !wp || typeof wp.lat !== 'number' || typeof wp.lng !== 'number'
      );

      if (hasInvalidWaypoints) {
        console.error('[RouteCache] Invalid waypoints detected, skipping cache lookup');
        return null;
      }

      cacheKey = this.generateCacheKey(waypoints);
    }
    let cachedRoute: CachedRoute | null = null;

    if (this.config.storageType === 'memory') {
      cachedRoute = this.memoryCache.get(cacheKey) || null;
    } else {
      try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          cachedRoute = JSON.parse(stored);
          // Convert plain objects back to L.LatLng only if we have waypoints stored
          if (cachedRoute && cachedRoute.waypoints) {
            cachedRoute.waypoints = cachedRoute.waypoints.map(wp => 
              L.latLng(wp.lat, wp.lng)
            );
          }
        }
      } catch (error) {
        console.warn('Failed to read route cache from localStorage:', error);
        return null;
      }
    }

    if (!cachedRoute || !this.isValid(cachedRoute)) {
      console.log('[RouteCache] Cache miss or expired route');
      this.delete(cacheKey);
      return null;
    }

    // Verify waypoints match (additional safety check) - only for waypoint-based caching
    if (waypoints && cachedRoute.waypoints && !this.waypointsMatch(waypoints, cachedRoute.waypoints)) {
      console.warn('[RouteCache] Waypoint mismatch, invalidating cache');
      this.delete(cacheKey);
      return null;
    }

    console.log('[RouteCache] Cache hit! Returning cached route data:', {
      coordinateCount: cachedRoute.data.coordinates?.length || 0,
      distance: cachedRoute.data.summary?.totalDistance,
      duration: cachedRoute.data.summary?.totalTime,
      age: Date.now() - cachedRoute.timestamp
    });

    return cachedRoute.data;
  }

  // Store route data in cache - now accepts both route ID strings and waypoint arrays
  set(key: string | L.LatLng[], data: any): void {
    console.log('[RouteCache] Cache set request:', {
      keyType: typeof key,
      isString: typeof key === 'string',
      key: typeof key === 'string' ? key : `waypoints(${key.length})`,
      dataExists: !!data,
      coordinateCount: data?.coordinates?.length || 0,
      ...(typeof key !== 'string' && {
        waypointCount: key.length,
        waypoints: key.map((wp, index) => ({
          index,
          hasLat: wp && typeof wp.lat !== 'undefined',
          hasLng: wp && typeof wp.lng !== 'undefined',
          lat: wp?.lat,
          lng: wp?.lng
        }))
      })
    });

    let cacheKey: string;
    let waypoints: L.LatLng[] | null = null;

    if (typeof key === 'string') {
      // Route ID based caching
      cacheKey = `route_id_${key}`;
      console.log('[RouteCache] Using route ID cache key:', cacheKey);
    } else {
      // Waypoint-based caching (fallback)
      waypoints = key;
      if (waypoints.length < 2) {
        console.log('[RouteCache] Insufficient waypoints for caching');
        return;
      }

      // Validate waypoints before processing
      const hasInvalidWaypoints = waypoints.some(wp => 
        !wp || typeof wp.lat !== 'number' || typeof wp.lng !== 'number'
      );

      if (hasInvalidWaypoints) {
        console.error('[RouteCache] Invalid waypoints detected, skipping cache storage');
        return;
      }

      cacheKey = this.generateCacheKey(waypoints);
    }

    const cachedRoute: CachedRoute = {
      data,
      timestamp: Date.now(),
      waypoints: waypoints ? [...waypoints] : [] // Create a copy if we have waypoints
    };

    console.log('[RouteCache] Storing route in cache:', {
      cacheKey,
      dataExists: !!data,
      coordinateCount: data?.coordinates?.length || 0,
      distance: data?.summary?.totalDistance,
      duration: data?.summary?.totalTime,
      timestamp: cachedRoute.timestamp
    });

    if (this.config.storageType === 'memory') {
      // Implement LRU-like behavior for memory cache
      if (this.memoryCache.size >= this.config.maxEntries) {
        const firstKey = this.memoryCache.keys().next().value;
        if (firstKey) {
          this.memoryCache.delete(firstKey);
        }
      }
      this.memoryCache.set(cacheKey, cachedRoute);
    } else {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cachedRoute));
        this.cleanupLocalStorage();
      } catch (error) {
        console.warn('Failed to save route cache to localStorage:', error);
        // Fall back to memory cache if localStorage fails
        this.memoryCache.set(cacheKey, cachedRoute);
      }
    }
  }

  // Delete a specific cache entry
  private delete(key: string): void {
    if (this.config.storageType === 'memory') {
      this.memoryCache.delete(key);
    } else {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to delete route cache from localStorage:', error);
      }
    }
  }

  // Check if waypoints arrays match
  private waypointsMatch(waypoints1: L.LatLng[], waypoints2: L.LatLng[]): boolean {
    if (waypoints1.length !== waypoints2.length) return false;
    
    return waypoints1.every((wp1, index) => {
      const wp2 = waypoints2[index];
      // Use small tolerance for floating point comparison
      return Math.abs(wp1.lat - wp2.lat) < 0.000001 && 
             Math.abs(wp1.lng - wp2.lng) < 0.000001;
    });
  }

  // Clean up old localStorage entries
  private cleanupLocalStorage(): void {
    if (this.config.storageType !== 'localStorage') return;

    try {
      // Get both old waypoint-based cache keys and new route ID cache keys
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('route_') || key.startsWith('route_id_')
      );
      const entries: { key: string; timestamp: number }[] = [];

      // Collect all route cache entries with their timestamps
      for (const key of keys) {
        try {
          const cached = JSON.parse(localStorage.getItem(key) || '{}');
          if (cached.timestamp) {
            entries.push({ key, timestamp: cached.timestamp });
          }
        } catch {
          // Remove invalid entries
          localStorage.removeItem(key);
        }
      }

      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove expired entries
      const now = Date.now();
      const validEntries = entries.filter(entry => {
        if ((now - entry.timestamp) >= this.config.maxAge) {
          localStorage.removeItem(entry.key);
          return false;
        }
        return true;
      });

      // Remove oldest entries if we exceed maxEntries
      if (validEntries.length > this.config.maxEntries) {
        const entriesToRemove = validEntries.slice(0, validEntries.length - this.config.maxEntries);
        entriesToRemove.forEach(entry => {
          localStorage.removeItem(entry.key);
        });
      }
    } catch (error) {
      console.warn('Failed to cleanup localStorage route cache:', error);
    }
  }

  // Clear all cached routes
  clear(): void {
    if (this.config.storageType === 'memory') {
      this.memoryCache.clear();
    } else {
      try {
        // Clear both old waypoint-based cache keys and new route ID cache keys
        const keys = Object.keys(localStorage).filter(key => 
          key.startsWith('route_') || key.startsWith('route_id_')
        );
        keys.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear route cache from localStorage:', error);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; oldestEntry?: number; newestEntry?: number } {
    if (this.config.storageType === 'memory') {
      const timestamps = Array.from(this.memoryCache.values()).map(cache => cache.timestamp);
      return {
        size: this.memoryCache.size,
        oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
        newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : undefined
      };
    } else {
      try {
        // Get both old waypoint-based cache keys and new route ID cache keys
        const keys = Object.keys(localStorage).filter(key => 
          key.startsWith('route_') || key.startsWith('route_id_')
        );
        const timestamps: number[] = [];
        
        for (const key of keys) {
          try {
            const cached = JSON.parse(localStorage.getItem(key) || '{}');
            if (cached.timestamp) {
              timestamps.push(cached.timestamp);
            }
          } catch {
            // Ignore invalid entries
          }
        }

        return {
          size: keys.length,
          oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
          newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : undefined
        };
      } catch (error) {
        console.warn('Failed to get cache stats:', error);
        return { size: 0 };
      }
    }
  }
}

// Create a singleton instance
export const routeCache = new RouteCache();

// Export the class for custom instances if needed
export { RouteCache };
