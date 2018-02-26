import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';
import {appApis} from "../../providers/apis";
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
  phoneValue;
  codeValue;
  pwValue;
  rePwValue;
  canclick = true;
  code;
  data: any = [];
  countinterval3;
  time3 = 60;/*loginbox*/
  constructor(public navCtrl: NavController,private alertCtrl: AlertController, public navParams: NavParams, private httpService: HttpServiceProvider) {
  }

  ionViewDidLoad() {
    $('.loginbox').css('height',document.documentElement.clientHeight);
    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e){
      // console.log('Keyboard height is: ' + e.keyboardHeight);

      this.content.scrollTo(0,document.body.clientHeight);



    }
  }
  // 发送验证码
  sendCodeF(): void {
    if ( this.phoneValue === '' || !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.phoneValue ))) {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请填写正确的手机号',
        buttons: ['确定']
      });
      alert.present();
      console.log(this.phoneValue);
    }else {
      if (this.canclick) {
        this.sCode();
      } else {
        return;
      }
    }
  }
  sCode() {
    const getStr = {
      'mobile':this.phoneValue,
      'type': '0005'
    }
    // console.log(getStr)
    this.httpService.get(appApis.get_app_code + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data.code === 0) {
          let alert = this.alertCtrl.create({
            title: '提示信息',
            subTitle: data.msg,
            buttons: ['确定']
          });
          alert.present();
        }
        this.data = data;
        // $('.safeCode').html(this.data.msg);
        this.code = this.data.msg;
        let count = this.time3;
        if ( this.code === '发送验证码成功!') {
          this.countinterval3 = setInterval( () => {
            $('.codeFor').html(count + 's后重发');
            if (count <= 0) {
              count = this.time3;
              clearInterval(this.countinterval3);
              $('.codeFor').html('获取');
              this.canclick = true;
            }else {
              count--;
            }
          }, 1000);
          this.canclick = false;
        }
        return this.data;
      },
      error => {
        console.error(error);
        return this.data;
      });
  }
  // 确认修改
  changeWord(): void {
    if ( !this.phoneValue|| !(/^1[3|4|5|8][0-9]\d{8}$/.test( this.phoneValue + '' ))) {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请填写正确的手机号',
        buttons: ['确定']
      });
      alert.present();
    }else if(!this.pwValue){
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请填写密码',
        buttons: ['确定']
      });
      alert.present();
    } else if(this.pwValue != this.rePwValue){
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '两次密码不一致',
        buttons: ['确定']
      });
      alert.present();
    }else if(!this.codeValue){
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请填写验证码',
        buttons: ['确定']
      });
      alert.present();
    } else{
      const postStr = {
        'type': '0005',
        'data': {
          'mobile': this.phoneValue,
          'vcode':  this.codeValue ,
          'password': this.rePwValue
        },
        'operate': 'M'
      };
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
        // console.log(data);
          if (data.code){
            this.data = data;
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: data.msg,
              buttons: ['确定']
            });
            alert.present();
            this.navCtrl.push(LoginPage);
            return this.data;
          }else {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: data.msg,
              buttons: ['确定']
            });
            alert.present();
          }
        },
        error => {
          console.error(error);
          return this.data;
        });
    }
  }
  toLogin(){
    this.navCtrl.push(LoginPage);
  }
  // 游客模式
  visitor() {
    this.navCtrl.popToRoot();
  }
}
