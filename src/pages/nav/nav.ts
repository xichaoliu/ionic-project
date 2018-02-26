import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {MapPage} from "../map/map";
import {Store} from '@ngrx/store';
import {Region} from "../../stateStore/log.store";
import {REGION_CODE, REGION_COORDS, REGION_SWITCH} from "../../stateStore/action";
import {Subscription} from "rxjs/Subscription";
import {Geolocation} from "@ionic-native/geolocation";

import {SearchPage} from '../search/search';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import {MsgCenterPage} from '../msg-center/msg-center';
import {SwitchCityPage} from "../switch-city/switch-city";
import {LoginPage} from "../login/login";
import "rxjs/add/operator/filter";

declare let BMap:any;

@Component({
  selector: 'page-nav',
  templateUrl: 'nav.html',
})
export class NavPage{
s1 = true; // 控制文化页面显示/隐藏
s2 = false; // 控制地图页面显示/隐藏
s3 = false; // 控制活动页面显示/隐藏
s4 = false; // 控制品味页面显示/隐藏
s5 = false; // 控制我页面显示/隐藏
url: any;
// 地区选择
options = [
  {'value': '济南市','code':'370000'},
  {'value': '青岛市','code':'370200'},
  {'value': '淄博市','code':'370300'}
];
selOpt:any = '济南市';
regionArr:any[];
timer:any;
located = false;
rgCode:any = '370000';
islogin;
rgCoord:any = '117.02496706629,36.682784727161';
s:Subscription;
flag = true;
  memsg;
locateSuccess = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store:Store<Region>,
    private geolocation:Geolocation,
    private httpService: HttpServiceProvider,
    public alertCtrl: AlertController,
  ) {
    this.s = this.store.select(('region' as any)).filter((log)=>{
      if(this.flag){
        return log.city !== this.selOpt;
      }else {
        return false
      }
    }).subscribe((log)=>{
      // if(log.city){
      //   this.selOpt = log.city;
      // }
      if (log.city && log.city!== this.selOpt && this.flag) {
        this.flag = false;
        let alert= this.alertCtrl.create({

          title: '您选的城市和当前所在城市不一致，是否切换？',

          buttons: [

            {
              text: '是',
              handler: ()=> {
                this.selOpt = log.city;
                this.rgCode = log.region_code;
                this.rgCoord = log.region_coords;
                if(!this.locateSuccess){
                  const cod = this.rgCoord.split(',');
                  localStorage.lon = cod[0];
                  localStorage.lat = cod[1];
                }
              }
            },
            {

              text: '否',
              handler: ()=> {
                this.store.dispatch({type: REGION_SWITCH, payload: this.selOpt});
                this.store.dispatch({type: REGION_CODE, payload: this.rgCode});
                this.store.dispatch({type: REGION_COORDS, payload: this.rgCoord});
              }
            }

          ]

        });
        alert.present();
      }
    });
  }
  ionViewDidLoad() {
    this.getRegionCode();
  }
  /*是否登录 传给me*/
  ionViewWillEnter(){
    if(localStorage.getItem('usid')){
      this.islogin = 1;
      // console.log(this.islogin);
      this.getUserInfor();
    }else{
      this.islogin = 0;
      // console.log(this.islogin);
      if(!this.s3 && !this.s4 && !this.s1){
        this.s1 = true;
        this.s2 = false;
        this.s3 = false;
        this.s4 = false;
        this.s5 = false;
      }
    }
  }
  /*刷新用户信息*/
  getUserInfor(){
    const str = {
      'type': '0006',
      filters: {
        'id': localStorage.getItem('usid'),
        'accid': ''
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(str),
      data => {
        if (data.code === 1) {
          this.memsg = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  ionViewDidEnter() {
    //根据设备尺寸固定内容高度
    const div = document.getElementById('cont');
    const totalHeight = document.body.clientHeight - 103;
    div.setAttribute('style',`height:${totalHeight}px`);
    if(!this.located){
      this.getPos();
    }
  }
  isShow($event){
    this.s1 = false;
    this.s2 = false;
    this.s3 = false;
    this.s5 = false;
    this.s4 = $event;
  }
  ionViewDidLeave() {
    this.flag = true;
  }
  // 获取行政区划代码
  getRegionCode() {
    const str = {
      "type": "6003",
      "filters": {
        "regional_code": "370000", // 山东省
        "regional_level": 1
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(str),
      data => {
        if(data.code === 1){
          // console.log(JSON.stringify(data.data));
          this.regionArr = data.data;
        }
      },
      error=> {
        console.log(JSON.stringify(error));
      })
  }

  // 定位
  getPos() {
    this.located = true;
    const that = this;
    /**
     * @param timeout 定位方法返回时长，默认值为无限长，意味着在设备位置可获取之前getCurrentPosition()将不会有返回值
     * 参考网址：https://ionicframework.com/docs/native/geolocation/
     */
    this.geolocation.getCurrentPosition({timeout:3000})
      .then((resp) => {
      // alert('gps定位成功');
      // console.log('ff',resp);
        that.locateSuccess = true;
      let geoc = new BMap.Geocoder();
      // const pt ={"lng":resp.coords.longitude,"lat":resp.coords.latitude}
      localStorage.setItem('lon',resp.coords.longitude.toString());
      localStorage.setItem('lat',resp.coords.latitude.toString());
      let pt = new BMap.Point(resp.coords.longitude,resp.coords.latitude);
      geoc.getLocation(pt, function(rs){
        let addComp = rs.addressComponents;
        // alert(addComp.city );
        localStorage.setItem('gps',addComp.city);
        that.selOpt = addComp.city;
        that.store.dispatch({type: REGION_SWITCH, payload: that.selOpt});
        if(that.regionArr){
          for(let i in that.regionArr) {
            if( that.regionArr[i].regional_name ==  addComp.city ) {
              that.store.dispatch({type: REGION_CODE, payload:that.regionArr[i].regional_code});
            }
          }
        }
      });
    }).catch((error) => {
      // alert('aps定位失败');
      // console.log('Error getting location', JSON.stringify(error));
      if(error.message === 'Illegal Access'){
        //用户拒绝,默认定位到济南
        // alert('用户拒绝');
        that.selOpt = '济南市';
        localStorage.setItem('lon','117.02496706629');
        localStorage.setItem('lat','36.682784727161');
        that.store.dispatch({type: REGION_SWITCH, payload: that.selOpt});
        that.store.dispatch({type: REGION_CODE, payload:'370000'});
        that.store.dispatch({type: REGION_COORDS, payload:'117.02496706629,36.682784727161'});
        that.rgCode = '370000';
        that.rgCoord = '117.02496706629,36.682784727161';
      }else{
        // 允许定位但定位失败
        // alert('用户允许但定位失败');
        that.bdPos();
      }
    });
  }


  // 百度地图定位
  bdPos() {
    this.locateSuccess = true;
    const that = this;
    function myFun(r){
      let cityName = r.name;
      localStorage.setItem('gps',cityName);
      that.selOpt = r.name;
      that.store.dispatch({type: REGION_SWITCH, payload: that.selOpt});
      localStorage.setItem('lon',r.center.lng);
      localStorage.setItem('lat',r.center.lat);
      for(let i in this.regionArr) {
        if( that.regionArr[i].regional_name ==  r.address.city ) {
          that.store.dispatch({type: REGION_CODE, payload:this.regionArr[i].regional_code});
        }
      }
    }
    let myCity = new BMap.LocalCity();
    myCity.get(myFun);
  }
  showHide() {
    this.navCtrl.push(SwitchCityPage,{
      item: this.regionArr
    })
  }
  //tab切换
  culShow() {
  this.s1 = true;
  this.s2 = false;
  this.s3 = false;
  this.s4 = false;
  this.s5 = false;
}
mapShow() {
  this.navCtrl.push(MapPage);
}
activeShow() {
  this.s1 = false;
  this.s2 = false;
  this.s3 = true;
  this.s4 = false;
  this.s5 = false;
}
tasteShow() {
  this.s1 = false;
  this.s2 = false;
  this.s3 = false;
  this.s4 = true;
  this.s5 = false;
}
meShow() {
    // 登录注册判断
  if(!localStorage.getItem('usid')){
    this.navCtrl.push(LoginPage);
  }else{
    this.s1 = false;
    this.s2 = false;
    this.s3 = false;
    this.s4 = false;
    this.s5 = true;
  }
}
search(){
  this.navCtrl.push(SearchPage);
}
open_msgbox(){
  if(!localStorage.getItem('usid')){
    this.navCtrl.push(LoginPage);
  }else{
  this.navCtrl.push(MsgCenterPage);
  }
}
}
