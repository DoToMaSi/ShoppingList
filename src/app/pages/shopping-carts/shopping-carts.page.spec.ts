import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingCartsPage } from './shopping-carts.page';
import { ListService } from 'src/app/services/list.service';

describe('ShoppingCartsPage', () => {
  let component: ShoppingCartsPage;
  let fixture: ComponentFixture<ShoppingCartsPage>;
  let listServiceSpy: any;

  beforeEach(waitForAsync(() => {
    listServiceSpy = jasmine.createSpyObj('ListService', ['getShoppingCarts', 'getCartById']);

    TestBed.configureTestingModule({
      declarations: [ ShoppingCartsPage ],
      providers: [
        { provide: ListService, useValue: listServiceSpy }
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
