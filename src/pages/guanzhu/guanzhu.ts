import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {appApis} from '../../providers/apis';
import {HttpServiceProvider} from '../../providers/http-service/http-service';

/**
 * Generated class for the GuanzhuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-guanzhu',
  templateUrl: 'guanzhu.html',
})
export class GuanzhuPage {
  guanzhulist:any=[];
  constructor(public navCtrl: NavController,private toastCtrl: ToastController, public navParams: NavParams,private httpService: HttpServiceProvider) {
  }

  cancle($event){
    // console.log($event);
    this.getguanzhu();
  }
  ionViewDidLoad() {
    this.getguanzhu();
    // console.log('ionViewDidLoad GuanzhuPage');
  }
  // toplaceDel(stationID, stationType){
  //   this.navCtrl.push(PlaceDelPage, {stationID: stationID, stationType:stationType});
  // }
  getguanzhu(){
      /*用户关注列表*/
      this.guanzhulist =[];
      const getStr = {
        'type': '0008',
        'sorts':{
          'sort':'createtime',
          'order':'desc'
        },
        'filters': {
          'accid': localStorage.getItem('usid'),
          'type': 0,
          'flag':1
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

            this.guanzhulist = data.data;
          }
        },
        error => {
          console.error(error);
        });

  }
 /*返回*/
 toBack(){
  this.navCtrl.pop();
}
}
