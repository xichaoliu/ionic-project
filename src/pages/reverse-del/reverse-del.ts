import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AppraiseSubmitPage} from "../appraise-submit/appraise-submit";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-reverse-del',
  templateUrl: 'reverse-del.html',
})
export class ReverseDelPage {
  status = 2;
  resDelID;
  resActdetail:any = {};
  order: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.resDelID = navParams.data.resDelID;

    // console.log(this.resDelID);
  }

  ionViewDidLoad() {
    this.getresActDetail();
    //根据设备尺寸固定内容高度
    const div = document.getElementById('reverdelBody');
    const tit = document.getElementsByClassName('redelTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }
  /*二维码刷新*/
  refresh(){
    this.getresActDetail();
  }
  // 获得对应的活动详情
  getresActDetail(){
    const getStr = {
      'type': '4003',
      'filters': {
        'id': this.resDelID
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
      // console.log(data);
        if (data && data.data) {
          this.resActdetail = data.data;
          if(data.data.order){
            this.order = data.data.order
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  /*取消订票*/
  cancelTicket(ordId) {
    const postStr = {
      'type': '4004',
      'key': ordId,
      'operate': 'M'
    };
    this.httpService.get(appApis.get_app_data+ '?postStr=' + JSON.stringify(postStr),
      data => {
        if (data.code) {
          alert(data.msg);
          this.getresActDetail();
        }else {
          alert(data.msg)
        }
      },
      error => {
        console.error(error);
      })
  }
  toAppraiseSub(){
    this.navCtrl.push(AppraiseSubmitPage);
  }

  toBack() {
    this.navCtrl.pop();
  }
}
