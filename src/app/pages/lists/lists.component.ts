import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListsComponent { }
