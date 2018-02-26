import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {SpaceDelPage} from "../space-del/space-del";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {TasteDelPage} from "../taste-del/taste-del";
import {ActDetailPage} from "../act-detail/act-detail";

@Component({
  selector: 'page-place-del',
  templateUrl: 'place-del.html',
})
export class PlaceDelPage {
  plaIndex = 0;
  stationID;
  stationType;
  placedel: any = {};
  spaceList: any = [];
  tasteList:any = [];
  actList: any = [];
  placeNav = [
    { id: 0, tit: '简介'},
    { id: 1, tit: '活动'},
    { id: 2, tit: '品味'},
    { id: 3, tit: '空间'},
  ];
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.stationID = navParams.data.stationID;
    this.stationType = navParams.data.stationType;
  }

  ionViewDidLoad() {
    /*//根据设备尺寸固定内容高度
    const div = document.getElementById('heiCon');
    const tit = document.getElementsByClassName('plaTop')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';*/
    /*         */
    this.gePlaDel();
    this.getSpaceList();
    this.getTastList();
    this.getActList();
  }
  /*导航切换*/
  changeNav(index) {
    this.plaIndex = index;
  }
  // 获得该页面站点详情
  gePlaDel() {
    const getStr = {
      'type': '3001',
      'filters': {
        'type': this.stationType,
        'accid': localStorage.getItem('usid'),
        'id': this.stationID
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr= ' + JSON.stringify(getStr),
      data => {
      // console.log(data);
        if (data && data.data) {
          this.placedel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  // 获得该站点活动列表
  getActList(){
    const getStr = {
      'type': '4000',
      'sorts':{
        'sort':'status',
        'order':'asc'
      },
      'filters': {
        'stationid': this.stationID
      }};
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
      // console.log(data);
        if (data && data.data){
          this.actList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*品味列表*/
  getTastList(){
    this.tasteList = [];
    const getStr = {
      'type': '11000'
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log(data);
        if (data && data.data){
          this.tasteList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*该站点空间列表*/
  getSpaceList(){
    const getStr = {
      'type': '3002',
      filters: {
        'sid': this.stationID
      }};
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data){
          this.spaceList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  // 收藏
  isCollect(id) {
    if (localStorage.getItem('usid')) {
      const postStr = {
        'type': '0009',
        'data': {
          'accid': localStorage.getItem('usid'),
          'bizid': id,
          'type': 0,
          'flag': 1
        },
        'operate': 'A'
      };
      this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data) { }},
        error => {
          if (error) {
            if (error.code === 1) {
              this.gePlaDel();
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '关注成功',
                buttons: ['确定']
              });
              alert.present();
            }else {
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '关注失败',
                buttons: ['确定']
              });
              alert.present();
            }
          }
        });
    }else {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请先登录',
        buttons: ['确定']
      });
      alert.present();
    }
  }
  // 取消收藏
  noCollect(collection_id) {
    const postStr = {
      'type': '0009',
      'key': collection_id,
      'operate': 'R'
    };
    this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
      data => {
        if (data) {
        }
      },
      error => {
        // console.log(error);
        if (error) {
          if (error.code === 1) {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '您已取消关注',
              buttons: ['确定']
            });
            alert.present();
            this.gePlaDel();
          }else {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '取消关注失败',
              buttons: ['确定']
            });
            alert.present();

          }
        }
      });
  }
  toActDel(id){
    this.navCtrl.push(ActDetailPage, {actid:id});
  }
  toTastDel(tastId){
    this.navCtrl.push(TasteDelPage,{tastId: tastId});
  }
  toSpaceDel(spaceId){
    this.navCtrl.push(SpaceDelPage,{spaceId:spaceId});
  }
  toBack() {
    this.navCtrl.pop();
  }
}
