import { DiskStorage } from './disk';
import type { StorageDriver } from './base';

let driver: StorageDriver | null = null;

export function getStorage(): StorageDriver {
  if (driver) return driver;
  driver = new DiskStorage();
  return driver;
}

export * from './base';
