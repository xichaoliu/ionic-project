import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {appApis} from '../../providers/apis';
import {HttpServiceProvider} from '../../providers/http-service/http-service';
import {MsgDelPage} from '../msg-del/msg-del';

/**
 * Generated class for the MsgCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-msg-center',
  templateUrl: 'msg-center.html',
})
export class MsgCenterPage {
  msglist: any = [];
  constructor(public navCtrl: NavController,private toastCtrl: ToastController, public navParams: NavParams,private httpService: HttpServiceProvider) {
  }

  ionViewDidLoad() {

    if(localStorage.getItem('usid') != undefined){

      this.getmsglist();
    }else{
      let toast = this.toastCtrl.create({
        message: '请先登录',
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        // console.log('Dismissed toast');
      });

      toast.present();
    }

  }
  getmsglist(){
      /*用户消息列表列表*/

    const getStr = {
      'type': '0010',
      'sorts':{
        'sort':'createtime',
        'order':'desc'
      },
      'filters': {
        'accid': localStorage.getItem('usid'),
        'status': -1
      }};
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log(data);
        if(data.data==''){
          let toast = this.toastCtrl.create({
            message: data.msg,
            duration: 3000,
            position: 'top'
          });

          toast.onDidDismiss(() => {
            // console.log('Dismissed toast');
          });

          toast.present();
        }
        if (data && data.data){

          this.msglist = data.data;
        }
      },
      error => {
        console.error(error);
      });

  }
  tomsgdel(msgid){
    this.navCtrl.push(MsgDelPage,{Msgid:msgid});
  }
  toBack() {
    this.navCtrl.pop();
  }
}
