import {Component} from '@angular/core';
import {appApis} from "../../providers/apis";
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {ActDetailPage} from '../act-detail/act-detail';
import {TasteDelPage} from '../taste-del/taste-del';
import {SpaceDelPage} from '../space-del/space-del';
import {ScenDelPage} from '../scen-del/scen-del';
import {HttpServiceProvider} from '../../providers/http-service/http-service';

/**
 * Generated class for the ShoucangjiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-shoucangjia',
  templateUrl: 'shoucangjia.html',
})
export class ShoucangjiaPage {
  plaIndex = 0;
  placeNav = [
    { id: 0, tit: '活动'},
    { id: 1, tit: '品味'},
    { id: 2, tit: '景点'},
    { id: 3, tit: '空间'}
  ];
  actList: any = [];
  tasteList:any = [];
  item: any = [];
  spaceList: any = [];
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,public navParams: NavParams, private httpService: HttpServiceProvider) {
  }
  ionViewWillEnter(){
    this.getTastList();
    this.getActList();
    this.getjingdianList();
    this.getSpaceList();
  }
  ionViewDidLoad() {}
  // 获得该站点活动列表
  getActList(){
    this.actList = [];
    const getStr = {
      'type': '0008',
      'sorts':{
        'sort':'createtime',
        'order':'desc'
      },
      'filters': {
        'accid': localStorage.getItem('usid'),
        'type': 1
      }};
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log(data);
        if (data && data.data){
          this.actList = data.data;
          let loader = this.loadingCtrl.create({
            content: "加载数据中...",
            duration: 500
          });
          loader.present();
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
      'type': '0008',
      'sorts':{
        'sort':'createtime',
        'order':'desc'
      },
      'filters': {
        'accid': localStorage.getItem('usid'),
        'type': 10
      }};
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
          // console.log('品味',data.data);
        if (data && data.data){
          this.tasteList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*景点收藏列表*/
  getjingdianList(){
    this.item = [];
    const getStr = {
      'type': '0008',
      'sorts':{
        'sort':'createtime',
        'order':'desc'
      },
      'filters': {
        'accid': localStorage.getItem('usid'),
        'type': 11
      }};
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log('景点',data.data);
        if (data && data.data){
          this.item = data.data;
        }
      },
      error => {
        console.error(error);
      });

}
  /*该站点空间列表*/
  getSpaceList(){
    this.spaceList = [];
    const getStr = {
      'type': '0008',
      'sorts':{
        'sort':'createtime',
        'order':'desc'
      },
      'filters': {
        'accid': localStorage.getItem('usid'),
        'type': 2
      }};
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log('空间',data.data);
        if (data && data.data){
          this.spaceList = data.data;
        }
      },
      error => {
        console.error(error);
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
  tojingdian(spaceId){
    this.navCtrl.push(ScenDelPage,{spaceId:spaceId});
  }

  changeNav(index) {
    this.plaIndex = index;
  }
  toBack() {
    this.navCtrl.pop();
  }
}
