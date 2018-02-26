import { Component } from '@angular/core';

/**
 * Generated class for the MsgPicComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'msg-pic',
  templateUrl: 'msg-pic.html'
})
export class MsgPicComponent {

  text: string;

  constructor() {
    // console.log('Hello MsgPicComponent Component');
    this.text = 'Hello World';
  }

}
