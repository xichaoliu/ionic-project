import { Component, Input } from '@angular/core';

/**
 * Generated class for the SeeHearComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'see-hear',
  templateUrl: 'see-hear.html'
})
export class SeeHearComponent {
  @Input() tasteList;

  constructor() {

  }

}
