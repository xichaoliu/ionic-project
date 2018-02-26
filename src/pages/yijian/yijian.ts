import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {appApis} from '../../providers/apis';
import {HttpServiceProvider} from "../../providers/http-service/http-service";

/**
 * Generated class for the YijianPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-yijian',
  templateUrl: 'yijian.html',
})
export class YijianPage {
  public content:any='';
  constructor(public navCtrl: NavController, private httpService: HttpServiceProvider,public navParams: NavParams,public toastCtrl: ToastController) {
  }
  tijiao(){
    if(this.content==''){
      let toast = this.toastCtrl.create({
        message: '请填写意见或建议内容！',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return false;
    }else{
      const getStr = {
        'type': '0012',
        'data':{
          'accid':localStorage.getItem('usid'),
          'mobile':localStorage.getItem('mobile'),
          'ask':this.content
        },
        'operate':'A'
      };
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(getStr),
        data => {
          // console.log(data);
          if (data && data.data){
            let toast = this.toastCtrl.create({
              message: data.msg,
              duration: 3000,
              position: 'middle'
            });
            toast.present();
            this.navCtrl.popToRoot();
          }
        },
        error => {
          console.error(error);
        });
    }

  }
  toBack(){
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad YijianPage');
  }

}
