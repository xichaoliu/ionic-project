import { Component, Input } from '@angular/core';

/**
 * Generated class for the AppraiseListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'appraise-list',
  templateUrl: 'appraise-list.html'
})
export class AppraiseListComponent {
  @Input() appralist;
  constructor() {

  }

}
