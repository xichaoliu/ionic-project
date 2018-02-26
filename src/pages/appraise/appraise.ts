import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";

@Component({
  selector: 'page-appraise',
  templateUrl: 'appraise.html',
})
export class AppraisePage {
  appraiID;
  appraise;
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpServiceProvider,) {
    this.appraiID = navParams.data.appraiID;
  }

  ionViewDidLoad() {
    this.getActAppraise();
    //根据设备尺寸固定内容高度
    const div = document.getElementById('appraiseBody');
    const tit = document.getElementsByClassName('appraTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }
  // 获得用户评价
  getActAppraise() {
    const getStr = {
      'type': '0016',
      'pagesize': 10 ,
      'pagenum': 1 ,
      'filters': {
        // 'accid':localStorage.getItem('usid'),
        'bizid': this.appraiID,
        'type': '1'
      }
    };
    // console.log(getStr);
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
      // console.log(data);
        if (data.data) {
          this.appraise = data.data;
          // 将评价星变为可循环的数组
          for (let i = 0; i < this.appraise.length; i++) {
            const arr = [];
            for (let j = 0; j < this.appraise[i].level; j++){
              arr.push(j);
            }
            this.appraise[i].level = arr;
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  toBack() {
    this.navCtrl.pop();
  }
}
