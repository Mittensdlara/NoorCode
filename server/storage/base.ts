export type StoredFile = {
  path: string;
  size: number;
  mimeType: string;
};

export interface StorageDriver {
  save(file: Buffer, filename: string, mimeType: string): Promise<StoredFile>;
  delete(path: string): Promise<void>;
  getPublicUrl?(path: string): string;
}
