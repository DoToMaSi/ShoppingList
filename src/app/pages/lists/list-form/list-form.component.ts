import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'list-form',
  templateUrl: 'list-form.component.html',
  styleUrl: 'list-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListFormComponent {
  listForm = new FormGroup({
    listName: new FormControl('', Validators.required),
    target: new FormControl(''),
    listType: new FormControl('', Validators.required),
  });

  constructor() { }
}
