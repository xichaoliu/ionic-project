import {Component} from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams} from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import {HttpClient} from '@angular/common/http';
import {HttpServiceProvider} from "../../providers/http-service/http-service";

import {appApis} from "../../providers/apis";
import {ROOT_URL} from "../../providers/config";

@Component({
  selector: 'page-appraise-submit',
  templateUrl: 'appraise-submit.html',
})
export class AppraiseSubmitPage {
  valueID;
  valueName;
  txtValue;
  porPath;
  subPath;
  actQuality = 0;
  plaQuality = 0;
  perQuality = 0;
  imgBox: any = [];
  public url: string = 'placeholder.jpg';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpService: HttpServiceProvider,
              public alertCtrl: AlertController,
              public camera: Camera) {
    this.valueID = navParams.data.valueID;
    this.valueName = navParams.data.valueName;
    // console.log('valueID', this.valueID);
  }

  ionViewDidLoad() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('subValBody');
    const tit = document.getElementsByClassName('valueTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }

  uploadFile($event): void {
    // console.log('event', JSON.stringify($event));
    if ($event) {
      this.httpService.upload(appApis.upload_app_file,
        $event,
        data => {
          // console.log(JSON.stringify(data.data));
          this.porPath = data.data.path;
          this.subPath = data.data.url;
          this.imgBox.push({id: this.imgBox.length, imgpath: data.data.path, imgSub: data.data.url});
        },
        error => {
          console.error(error);
        },
        "file")
    }
  }

  delet(id) {
    // console.log('index', id);
    for (let i = 0; i < this.imgBox.length; i++) {
      if (this.imgBox[i].id === id) {
        this.imgBox.splice(i, 1);
      }
    }
    // console.log(this.imgBox);
  }

  subAppraise() {
    let imgPath = '';
    // 处理图片路径
    for (let i = 0; i < this.imgBox.length; i++) {
      imgPath += this.imgBox[i].imgSub + ',';
    }
    const postStr = {
      'type': '0015',
      'data': {
        'accid': localStorage.getItem('usid'),
        'bizid': this.valueID,
        'type': '1',
        'level': '5',
        'name': this.valueName,
        'quality': this.actQuality,
        'site': this.plaQuality,
        'service': this.perQuality,
        'pic': imgPath.substr(0, imgPath.length - 1),
        'content': this.txtValue,
      },
      'operate': 'A',
    };
    // console.log(JSON.stringify(postStr));
    this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
      data => {
        // console.log('提交评价', JSON.stringify(data));
        if (data.code !== 1) {
          alert(data.data)
        } else if (data.code === 1) {
          alert(data.msg);
          this.imgBox = [];
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
