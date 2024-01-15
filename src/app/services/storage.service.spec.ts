import { TestBed, waitForAsync } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('StorageService', () => {
    let storageService: StorageService;
    let ionStorageSpy: any;

    beforeEach(waitForAsync(() => {
      ionStorageSpy = jasmine.createSpyObj('Storage', ['init']);

      TestBed.configureTestingModule({
        providers: [
          StorageService,
          { provide: Storage, useValue: ionStorageSpy },
        ]
      });

      storageService = TestBed.inject(StorageService);
    }));

    it('should create the service', () => {
        expect(storageService).toBeTruthy();
    });
});

