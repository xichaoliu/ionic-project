import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {RegistPage} from '../regist/regist';
import {ForgetPage} from '../forget/forget';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  phoneValue;
  pwValue;

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              public navParams: NavParams,
              private httpService: HttpServiceProvider) {

  }

  ionViewDidLoad() {
  }

  // 确认登录
  login() {
    if (!this.phoneValue) {
      let toast = this.toastCtrl.create({
        message: '请填写昵称或手机号',
        duration: 3000,
        position: 'middle'
      });
      toast.onDidDismiss(() => {
        // console.log('Dismissed toast');
      });
      toast.present();
      return;
    }else if (!this.pwValue ) {
      let toast = this.toastCtrl.create({
        message: '请填写密码',
        duration: 3000,
        position: 'middle'
      });
      toast.onDidDismiss(() => {
        // console.log('Dismissed toast');
      });
      toast.present();
      return;
    }else{
      const str = {
        'type': '0002',
        filters: {
          'loginname': this.phoneValue,
          'password': this.pwValue
        }
      };
      this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(str),
        data => {
          if (data.code === 1) {
            let toast = this.toastCtrl.create({
              message: data.msg,
              duration: 3000,
              position: 'middle'
            });

            toast.onDidDismiss(() => {
              // console.log('Dismissed toast');
            });
            toast.present();
            this.navCtrl.popToRoot();
            localStorage.setItem('usid', data.data.id);
            localStorage.setItem('mobile', data.data.mobile)
          }
          if (data.code === 0) {
            let toast = this.toastCtrl.create({
              message: data.msg,
              duration: 3000,
              position: 'middle'
            });

            toast.onDidDismiss(() => {
              // console.log('Dismissed toast');
            });

            toast.present();
          }
        },
        error => {
          console.error(error);
        });
    }

  }

  regist() {
    this.navCtrl.push(RegistPage);
  }

  wangji() {
    this.navCtrl.push(ForgetPage);
  }

  // 游客模式
  visitor() {
    this.navCtrl.popToRoot();
    // this.navCtrl.setRoot(NavPage);
  }

}
