import { Component,Input } from '@angular/core';

/**
 * Generated class for the CulActivityComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'cul-activity',
  templateUrl: 'cul-activity.html'
})
export class CulActivityComponent {
  @Input() actList;

  constructor() {

  }

}
