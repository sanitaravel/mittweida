import L from "leaflet";

export interface CachedRoute {
  data: any; // OSRM route response data
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
    const coordinates = waypoints.map(wp => `${wp.lat.toFixed(6)},${wp.lng.toFixed(6)}`);
    return `route_${coordinates.join('|')}`;
  }

  // Check if cached data is still valid
  private isValid(cachedRoute: CachedRoute): boolean {
    const now = Date.now();
    return (now - cachedRoute.timestamp) < this.config.maxAge;
  }

  // Get cached route data
  get(waypoints: L.LatLng[]): any | null {
    if (waypoints.length < 2) return null;

    const key = this.generateCacheKey(waypoints);
    let cachedRoute: CachedRoute | null = null;

    if (this.config.storageType === 'memory') {
      cachedRoute = this.memoryCache.get(key) || null;
    } else {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          cachedRoute = JSON.parse(stored);
          // Convert plain objects back to L.LatLng
          if (cachedRoute) {
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
      this.delete(key);
      return null;
    }

    // Verify waypoints match (additional safety check)
    if (!this.waypointsMatch(waypoints, cachedRoute.waypoints)) {
      this.delete(key);
      return null;
    }

    return cachedRoute.data;
  }

  // Store route data in cache
  set(waypoints: L.LatLng[], data: any): void {
    if (waypoints.length < 2) return;

    const key = this.generateCacheKey(waypoints);
    const cachedRoute: CachedRoute = {
      data,
      timestamp: Date.now(),
      waypoints: [...waypoints] // Create a copy
    };

    if (this.config.storageType === 'memory') {
      // Implement LRU-like behavior for memory cache
      if (this.memoryCache.size >= this.config.maxEntries) {
        const firstKey = this.memoryCache.keys().next().value;
        if (firstKey) {
          this.memoryCache.delete(firstKey);
        }
      }
      this.memoryCache.set(key, cachedRoute);
    } else {
      try {
        localStorage.setItem(key, JSON.stringify(cachedRoute));
        this.cleanupLocalStorage();
      } catch (error) {
        console.warn('Failed to save route cache to localStorage:', error);
        // Fall back to memory cache if localStorage fails
        this.memoryCache.set(key, cachedRoute);
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
      const keys = Object.keys(localStorage).filter(key => key.startsWith('route_'));
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
        const keys = Object.keys(localStorage).filter(key => key.startsWith('route_'));
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
        const keys = Object.keys(localStorage).filter(key => key.startsWith('route_'));
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
