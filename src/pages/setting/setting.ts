import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  isMess = false;
  idnum;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SettingPage');
  }
  toBack() {
    this.navCtrl.pop();
  }
  open_xiugaimima(num){
     /*显示弹出框*/
    this.isMess = true;
    this.idnum=num;
  }
  open_genggai(num){
      /*显示弹出框*/
      this.isMess = true;
      this.idnum=num;
  }
  open_huancun(num){
    /*显示弹出框*/
    this.isMess = true;
    this.idnum=num;
 }
    /*子组件传入的值*/
    messShow($event){
      this.isMess = false;
    }
  open_tuichu(num){
    this.isMess = true;
    this.idnum=num;

    }
}
