import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import {Coordination} from "../../stateStore/log.store";
import {Store} from "@ngrx/store";
import {CHOSED_ITEM} from "../../stateStore/action";

/**
 * Generated class for the MapSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-map-search',
  templateUrl: 'map-search.html',
})
export class MapSearchPage {
searchNav = [
  { id: 0, tit: '活动',type: '400004',mark:3},
  { id: 1, tit: '场馆',type: '300001',mark:2},
  { id: 2, tit: '景点',type: '1300001',mark:11}
];
searchIndex = 1;
sList = [
  '青岛市图书馆',
  '冰火魔术！让孩子爱上科学冰火魔术！让孩子爱上科学冰火魔术！让孩子爱上科学冰火魔术！让孩子爱上科学',
  '八大关，近代西式别墅群'
];
lon:any;//当前调用接口所用坐标
lat:any;
keyword:any;
searchType=2;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl:AlertController,
    private httpService: HttpServiceProvider,
    private store: Store<Coordination>
  ) {
  this.lon = this.navParams.get('lon');
  this.lat = this.navParams.get('lat');
  }

  ionViewDidLoad() {
    this.getData('300001')
  }
// 返回地图
  backToMap (){
    this.navCtrl.pop();
  }
  changeNav(s) {
    this.sList = null;
    this.searchIndex = s.id;
    this.searchType = s.mark;
    this.getData(s.type);
  }
  // 获取活动/场馆/景点的数据
  getData(type) {
    this.sList = null;
    if(type) {
      const str = {
        "type":type,
        "filters": {
          "lon":this.lon,
          "lat":this.lat,
          "distance":100
        }
      };
      this.httpService.get(appApis.get_app_data+'?getStr='+JSON.stringify(str),
        data => {
          if(data.code === 1){
            this.sList = data.data;
          }
        },
        error=> {
          console.log(JSON.stringify(error));
        })
    }
  }
  // 搜索
  search(){
    this.sList = null;
    if(!this.keyword){
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请输入搜索内容',
        buttons: ['确定']
      });
      alert.present();
    }else{
      const getStr = {
        'type': '6000',
        'filters': {
          'keyword': this.keyword,
          'type': this.searchType
        }
      };
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
        data => {
          if (data && data.data) {
            // alert(JSON.stringify(data.data));
            this.sList=data.data;
          }

        },
        error => {
          console.error(error);
        });
    }

  }
  // 带参路由跳转
  toNav(l) {
    this.store.dispatch({type:CHOSED_ITEM,payload:{
      item:l,
      id:this.searchIndex
    }});
    this.navCtrl.pop();
  };
}
