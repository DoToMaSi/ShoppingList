import { TestBed, waitForAsync } from '@angular/core/testing';
import { ListService } from './list.service';
import { StorageService } from './storage.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CurrencyPipe } from '@angular/common';

describe('ListService', () => {
  let listService: ListService;
  let storageSpy: any;
  let socialSharingSpy: any;
  let currencyPipeSpy: any;

  beforeEach(waitForAsync(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['init', 'get']);
    socialSharingSpy = jasmine.createSpyObj('SocialSharing', ['share']);
    currencyPipeSpy = jasmine.createSpyObj('CurrencyPipe', ['transform']);

    TestBed.configureTestingModule({
      providers: [
        ListService,
        { provide: StorageService, useValue: storageSpy },
        { provide: SocialSharing, useValue: socialSharingSpy },
        { provide: CurrencyPipe, useValue: currencyPipeSpy }
      ]
    });

    listService = TestBed.inject(ListService);
  }));

  it('should create the service', () => {
    expect(listService).toBeTruthy();
  });

  it('should call the \'getShoppingCartsSpy\' method', () => {
    const getShoppingCartsSpy = spyOn(listService, 'getLists');
    listService.getLists();
    expect(getShoppingCartsSpy).toHaveBeenCalledTimes(1);
  });
});
