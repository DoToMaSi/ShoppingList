import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingListPage } from './shopping-list.page';
import { ListService } from 'src/app/services/list.service';
import { ShoppingCartsPage } from '../shopping-carts/shopping-carts.page';

describe('ShoppingListPage', () => {
  let component: ShoppingListPage;
  let fixture: ComponentFixture<ShoppingListPage>;
  let listServiceSpy: any;

  beforeEach(waitForAsync(() => {
    listServiceSpy = jasmine.createSpyObj('ListService', ['getShoppingCarts', 'getCartById']);

    TestBed.configureTestingModule({
      declarations: [ ShoppingListPage ],
      providers: [
        { provide: ListService, useValue: listServiceSpy }
      ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes(
          [{path: 'shopping-carts', component: ShoppingCartsPage}]
        )
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
