import {Component, Input} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the MsgDelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-msg-del',
  templateUrl: 'msg-del.html',
})
export class MsgDelPage {
  @Input() msglist;
  Msgid;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.Msgid = navParams.data.actid;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MsgDelPage');
  }
  toBack() {
    this.navCtrl.pop();
  }
}
