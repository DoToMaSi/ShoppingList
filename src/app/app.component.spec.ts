import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { StorageService } from './services/storage.service';
import { StorageServiceMock } from './tests/mocks/storage.service.mock';

describe('AppComponent', () => {

  let storageSpy: any;

  beforeEach(waitForAsync(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['init']);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: StorageService, useValue: storageSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    app.ngOnInit();
    expect(storageSpy.init).toHaveBeenCalledTimes(1);
  });
});
