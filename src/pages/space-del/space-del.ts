import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlaceDelPage} from "../place-del/place-del";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {MapPage} from "../map/map";

@Component({
  selector: 'page-space-del',
  templateUrl: 'space-del.html',
})
export class SpaceDelPage {
  spaceId;
  spaceDel:any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.spaceId = navParams.data.spaceId;
  }
  ionViewDidLoad() {
    this.getSpaceList();
   /* //根据设备尺寸固定内容高度
    const div = document.getElementById('spacedelBody');
    const tit = document.getElementsByClassName('sdelTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';*/
  }
  /*该站点空间详情*/
  getSpaceList(){
    const getStr = {
      'type': '3003',
      filters: {
        'id': this.spaceId,
        'accid':localStorage.getItem('usid')
      }};
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        // console.log(data);
        if (data && data.data){
          this.spaceDel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  // 收藏/取消收藏
  reCollect($event){
    // console.log($event);
    this.getSpaceList();
  }
  /*场馆主页*/
  toplaceDel(stationID, stationType){
    this.navCtrl.push(PlaceDelPage,{stationID:stationID, stationType:stationType})
  }
  toBack() {
    this.navCtrl.pop();
  }
  navToMap() {
    this.navCtrl.push(MapPage,{
      'coord': this.spaceDel.coordinates
    })
  }
}
