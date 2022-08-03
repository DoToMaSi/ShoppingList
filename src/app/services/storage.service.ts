import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private storage: Storage | null = null;

  constructor(private ionStorage: Storage) {}

  public async init() {
    try {
      const storage = await this.ionStorage.create();
      this.storage = storage;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  public async get(key: string) {
    return this.storage.get(key);
  }

  public async set(key: string, data: any) {
    return this.storage.set(key, data);
  }

  public async clear() {
    return this.storage.clear();
  }
}
