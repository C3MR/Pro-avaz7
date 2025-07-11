/**
 * Simple offline storage utility for caching data
 */
export class OfflineStorage {
  private prefix: string;
  
  constructor(prefix: string = 'app_cache_') {
    this.prefix = prefix;
  }
  
  /**
   * Save data to localStorage with TTL
   */
  public save(key: string, data: any, ttlInMinutes?: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const storageItem = {
        data,
        timestamp: Date.now(),
        expiresAt: ttlInMinutes ? Date.now() + (ttlInMinutes * 60 * 1000) : null
      };
      
      localStorage.setItem(
        `${this.prefix}${key}`,
        JSON.stringify(storageItem)
      );
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
  
  /**
   * Get data from localStorage if it exists and is not expired
   */
  public get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      
      if (!item) return null;
      
      const storageItem = JSON.parse(item);
      
      // Check if data has expired
      if (storageItem.expiresAt && Date.now() > storageItem.expiresAt) {
        // Data expired, remove it
        this.remove(key);
        return null;
      }
      
      return storageItem.data;
    } catch (e) {
      console.warn('Failed to get from localStorage:', e);
      return null;
    }
  }
  
  /**
   * Remove data from localStorage
   */
  public remove(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  }
  
  /**
   * Clear all data with this prefix from localStorage
   */
  public clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }
  
  /**
   * Check if key exists in localStorage and is not expired
   */
  public has(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      
      if (!item) return false;
      
      const storageItem = JSON.parse(item);
      
      // Check if data has expired
      if (storageItem.expiresAt && Date.now() > storageItem.expiresAt) {
        // Data expired, remove it
        this.remove(key);
        return false;
      }
      
      return true;
    } catch (e) {
      console.warn('Failed to check localStorage:', e);
      return false;
    }
  }
}

// Export default instance
export const offlineStorage = new OfflineStorage();