import { Component, Input } from '@angular/core';

/**
 * Generated class for the SpaceListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'space-list',
  templateUrl: 'space-list.html'
})
export class SpaceListComponent {
  @Input() spaceList;
  constructor() {

  }

}
