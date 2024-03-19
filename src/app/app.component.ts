import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(
    public storageService: StorageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.storageService.init();
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang());
  }
}
