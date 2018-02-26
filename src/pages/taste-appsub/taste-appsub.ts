import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";

@Component({
  selector: 'page-taste-appsub',
  templateUrl: 'taste-appsub.html',
})
export class TasteAppsubPage {
  tastValue;
  tasteID;
  tasteTit;
  tastValueList:any = [];
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.tasteID = navParams.data.tasteID;
    this.tasteTit = navParams.data.tasteTit;
  }

  ionViewDidLoad() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('tasApSubBody');
    const tit = document.getElementsByClassName('tasSubTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
    this.getValueList();
  }
  // 获得见闻评论列表
  getValueList() {
    const getPageStr = {
      'type': '0016',
      'filters': {
        'type': '10',
        'bizid': this.tasteID,
      },
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getPageStr),
      data => {
        if (data && data.data) {
          this.tastValueList = data.data;
        }},
      error => {
        console.error(error);
      });
  }

  // 提交评论
  subValue() {
    if (localStorage.getItem('usid')){
      if(this.tastValue == ""){
        let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: '评论内容不能为空',
          buttons: ['确定']
        });
        alert.present();
      }else{
        this.Value();
      }
    }else {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请先登录',
        buttons: ['确定']
      });
      alert.present();
    }

  }
  // 提交评论
  Value() {
    const postStr = {
      'type': '0015',
      'operate': 'A',
      'data': {
        'bizid': this.tasteID,
        'accid': localStorage.getItem('usid'),
        'type': '10',
        'content': this.tastValue,
        'name': this.tasteTit,
        'level': '5'
      }
    };
    this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
      data => {
      // console.log(data);
        if (data.code) {
          this.tastValue = '';
          this.getValueList();
        }
      },
      error => {
        console.error(error);
      });
  }
  toBack() {
    this.navCtrl.pop();
    // this.navCtrl.push(TasteDelPage);
  }
}
