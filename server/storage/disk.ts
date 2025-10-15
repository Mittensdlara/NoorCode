import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { StorageDriver, StoredFile } from './base';

export class DiskStorage implements StorageDriver {
  constructor(private root: string = process.env.FILE_STORAGE_ROOT || './public/uploads') {}

  private async ensureDir() {
    await mkdir(this.root, { recursive: true });
  }

  async save(file: Buffer, filename: string, mimeType: string): Promise<StoredFile> {
    await this.ensureDir();
    const id = randomUUID();
    const storedName = `${id}-${filename}`;
    const filePath = join(this.root, storedName);
    await writeFile(filePath, file);
    return { path: storedName, size: file.length, mimeType };
  }

  async delete(path: string): Promise<void> {
    await rm(join(this.root, path), { force: true });
  }

  getPublicUrl(path: string): string {
    return `/uploads/${path}`;
  }
}
