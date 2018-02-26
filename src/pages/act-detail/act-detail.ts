import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {PlaceDelPage} from "../place-del/place-del";
import {ReversePage} from "../reverse/reverse";
import {AppraisePage} from "../appraise/appraise";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {VideoPage} from "../video/video";
import {MapPage} from "../map/map";
import {Coordination} from "../../stateStore/log.store";
import {Store} from "@ngrx/store";
import {COORD} from "../../stateStore/action";


@Component({
  selector: 'page-act-detail',
  templateUrl: 'act-detail.html',
})
export class ActDetailPage {
  actId;
  actDel: any = {};
  prePage:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider,
    private store:Store<Coordination>,
    private alertCtrl: AlertController
    ) {
    this.actId = navParams.data.actid;
  }
  ionViewDidLoad() {
    this.getActDetail();
  }
ionViewDidEnter() {
 this.prePage = this.navCtrl.getPrevious().component.name;
}
  // 获得对应的活动详情
  getActDetail() {
    const getStr = {
      'type': '4001',
      'filters': {
        'accid': localStorage.getItem('usid'),
        'id': this.actId
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data) {
          // this.reRender(data.data.description);
          this.actDel = data.data;
          // console.log(this.actDel);
        }
      },
      error => {
        console.error(error);
      });
  }
  /*场馆主页*/
  toplaceDel(stationID, stationType){
    this.navCtrl.push(PlaceDelPage, {stationID: stationID, stationType:stationType});
  }
  /*活动直播*/
  tovideo(videoId){
    this.navCtrl.push(VideoPage,{videoId: videoId});
  }
  /*活动预定*/
  toReserve(actdel){
    if(localStorage.getItem('usid')){
      this.navCtrl.push(ReversePage,{actdel: actdel});
    }else{
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '您还未登录',
        buttons: ['确定']
      });
      alert.present();
      // this.navCtrl.push(LoginPage);
    }
  }
  // 收藏/取消收藏
  reCollect($event){
    this.getActDetail();
  }
  /*精彩点评*/
  toAppraise(appraiID){
    this.navCtrl.push(AppraisePage,{appraiID:appraiID});
  }
  toBack() {
    this.navCtrl.pop();
    // this.navCtrl.push(MapPage);
  }
  // 地图导航
  actToMap() {
    this.store.dispatch({type:COORD,payload:this.actDel.coordinates});
    this.navCtrl.pop();
    if(this.prePage !== 'MapPage'){
      // alert('未从map页进入跳转');
      this.navCtrl.push(MapPage,{'mp':true})
    }

  }

}
