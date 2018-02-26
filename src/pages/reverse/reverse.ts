import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {ReverseDelPage} from "../reverse-del/reverse-del";
import $ from 'jquery';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {AppraiseSubmitPage} from "../appraise-submit/appraise-submit";

@Component({
  selector: 'page-reverse',
  templateUrl: 'reverse.html',
})
export class ReversePage {
  isMess = false;
  nameValue = '';
  phoneValue;
  actDel: any = {};
  resDelID;
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.actDel = navParams.data.actdel;
  }

  ionViewDidLoad() {
    this.getUserList();
    //根据设备尺寸固定内容高度
    const div = document.getElementById('reverBody');
    const tit = document.getElementsByClassName('reverTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }
  /*个人信息*/
  //  获得用户详情
  getUserList() {
    const getStr = {
      'type':  '0006',
      'filters': {
        'id': localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data) {
          // console.log(data);
          if (data.data) {
            this.phoneValue = data.data.mobile;
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  /*活动提交*/
  sureMess(){
    const postStr = {
      'type': '4004',
      'operate': 'A',
      'data': {
        'accid': localStorage.getItem('usid'),
        'activityid': this.actDel.id,
        'mobile': this.phoneValue,
        'ticket': $('.poll').html(),
        'venuesid': '',
        'accname': this.nameValue
      }
    };
    // console.log(postStr);
    if(this.nameValue == '') {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '用户名不能为空',
        buttons: ['确定']
      });
      alert.present();
    }else if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.phoneValue))){
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '手机号填写有误',
        buttons: ['确定']
      });
      alert.present();
    }else{
      // console.log('111');
      this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
        // console.log(data);
        },
        error => {
        // console.log(error);
          if (error.code) {
            this.isMess = true;
            this.resDelID = error.data.id;
          }else {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: error.msg,
              buttons: ['确定']
            });
            alert.present();
          }
        });
    }
  }
  /*票数减*/
  decrease(){
    let count = parseInt($('.poll').html());
    count--;
    if (count <= 0){
      count = 1;
    }
    $('.poll').html('' + count);
  }
  /*票数加*/
  increase(restrict){
    let count = parseInt($('.poll').html());
    count++;
    if (count > restrict){
      count = restrict;
    }
    $('.poll').html('' + count);
  }
  /*前往订票详情页*/
  toReserDel(){
    this.navCtrl.push(ReverseDelPage);
  }
  /*子组件传入的值*/
  messShow($event){
    this.isMess = false;
  }
  toBack() {
    this.navCtrl.pop();
  }
  toappvalue(){
    this.navCtrl.push(AppraiseSubmitPage);
  }

}
