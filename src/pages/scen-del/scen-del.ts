import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {Store} from "@ngrx/store";
import {Coordination} from "../../stateStore/log.store";
import {COORD} from "../../stateStore/action";
import {MapPage} from "../map/map";

/**
 * Generated class for the ScenDelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scen-del',
  templateUrl: 'scen-del.html',
})
export class ScenDelPage {
  scenicID:any;
  scenic:any;
  preSPage:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider,
    private store:Store<Coordination>
  ) {}

  ionViewDidLoad() {
    this.scenicID = this.navParams.get('scenicID');
    this.getScenicDetail();
  }
  ionViewDidEnter() {
    const div = document.getElementById('scen-body');
    const tit = document.getElementsByClassName('scen-page-title')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
    this.preSPage = this.navCtrl.getPrevious().component.name;
  }
  reCollect($event){
    this.getScenicDetail();
  }
  // 获取景点详情
  getScenicDetail() {
    this.scenic = null;
    const getStr = {
      'type': '13001',
      'filters': {
        'accid': localStorage.getItem('usid'),
        'id': this.scenicID
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data) {
          // console.log(JSON.stringify(data.data));
          this.scenic = data.data;
        }
        // ScenDelPage.setHeight();
      },
      error => {
        console.error(error);
      });
  }
  // 设置scenic-body高度
  static setHeight() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('scen-body');
    const tit = document.getElementsByClassName('scen-page-title')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
    // const h = document.documentElement.clientHeight - Number.parseInt($('.scen-page-title:first').css('height')) + 'px';
    // $('#scen-body').css('height',h);
  }
   // 返回
  toBack() {
    this.navCtrl.pop();
  }
  // 跳转地图
  toMap() {
    this.navCtrl.pop();
    this.store.dispatch({type:COORD,payload:this.scenic.coordinates});
    if(this.preSPage !== 'MapPage'){
      // alert('未从map页进入跳转');
      this.navCtrl.push(MapPage,{'mp':true})
    }
  }
}
