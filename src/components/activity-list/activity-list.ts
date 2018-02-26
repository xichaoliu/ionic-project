import { Component, Input } from '@angular/core';

@Component({
  selector: 'activity-list',
  templateUrl: 'activity-list.html'
})
export class ActivityListComponent {
  @Input() actList;
  text: string;

  constructor() {
  }

}
