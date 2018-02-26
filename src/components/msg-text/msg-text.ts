import { Component, Input } from '@angular/core';
import { MsgDelPage } from '../../pages/msg-del/msg-del';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the MsgTextComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'msg-text',
  templateUrl: 'msg-text.html'
})
export class MsgTextComponent {

  text: string;
  @Input() msglist;
  constructor(public navCtrl: NavController) {
    // console.log('Hello MsgTextComponent Component');
    this.text = 'Hello World';
  }
  open_msgdel(){
    this.navCtrl.push(MsgDelPage);
  }
  toBack() {
    this.navCtrl.pop();
  }
}
