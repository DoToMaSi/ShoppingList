import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private storage: Storage | null = null;

  constructor(private ionStorage: Storage) {}

  public async init() {
    await this.ionStorage.create();
  }

  public async get(key: string) {
    return this.ionStorage.get(key);
  }

  public async set(key: string, data: any) {
    return this.ionStorage.set(key, data);
  }

  public async clear() {
    return this.ionStorage.clear();
  }
}
