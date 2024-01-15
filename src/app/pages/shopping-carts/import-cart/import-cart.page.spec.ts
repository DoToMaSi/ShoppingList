import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportCartPage } from './import-cart.page';
import { ListService } from 'src/app/services/list.service';

describe('ImportCartPage', () => {
  let component: ImportCartPage;
  let fixture: ComponentFixture<ImportCartPage>;
  let listServiceSpy: any;

  beforeEach(waitForAsync(() => {
    listServiceSpy = jasmine.createSpyObj('ListService', ['getShoppingCarts', 'getCartById']);

    TestBed.configureTestingModule({
      declarations: [ ImportCartPage ],
      providers: [
        { provide: ListService, useValue: listServiceSpy }
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
