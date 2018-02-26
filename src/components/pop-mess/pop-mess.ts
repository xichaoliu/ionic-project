import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ReverseDelPage} from "../../pages/reverse-del/reverse-del";

@Component({
  selector: 'pop-mess',
  templateUrl: 'pop-mess.html'
})
export class PopMessComponent {
  @Output() messBox= new EventEmitter();
  @Input() resDelID;
  messClase = true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
  toReserDel(resDelID){
    this.navCtrl.push(ReverseDelPage, {resDelID:resDelID});
    this.messClase = false;
    this.messBox.emit(this.messClase);
  }
  /*返回*/
  toBack(){
    this.navCtrl.pop();
    this.messClase = false;
    this.messBox.emit(this.messClase);
  }
}
