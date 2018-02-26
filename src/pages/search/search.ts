import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {appApis} from '../../providers/apis';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ActDetailPage} from '../act-detail/act-detail';
import {TasteDelPage} from '../taste-del/taste-del';
import {PlaceDelPage} from '../place-del/place-del';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  plaIndex = 0;
  placeNav = [
    { id: 0, tit: '活动'},
    { id: 1, tit: '品味'},
    { id: 2, tit: '景点'},
    { id: 3, tit: '场馆'}
  ]
  public keywords = '';
  public type = 3;
  public actList=[];
  public tasteList=[];
  public item=[];
  public guanzhulist=[];
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,public navParams: NavParams,private httpService: HttpServiceProvider) {
  }
  toActDel(id) {
    this.navCtrl.push(ActDetailPage, {actid:id});
  }
  toTastDel(tastId){
    this.navCtrl.push(TasteDelPage,{tastId: tastId});
  }
  toplaceDel(stationID, stationType){
    this.navCtrl.push(PlaceDelPage,{stationID:stationID, stationType:stationType});
  }
  doserach(){
    if(this.keywords==''){
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
          'keyword': this.keywords,
          'type': this.type
        }
      };
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
        data => {
          if (data && data.data) {
              // console.log(JSON.stringify(data.data));
              this.actList=data.data;
           // this.scenic = data.data;
          }

        },
        error => {
          console.error(error);
        });
    }

  }
  ionViewDidLoad() {

    // console.log('ionViewDidLoad SearchPage');
  }
  changeNav(index) {
    this.plaIndex = index;
    // console.log(this.placeNav[index].tit);
    if(this.placeNav[index].tit=='活动'){
      this.type=3;
      if(this.keywords==''){
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
          'keyword': this.keywords,
          'type': this.type
        }
      };
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
        data => {
          if (data && data.data) {
              // console.log(JSON.stringify(data.data));
              this.actList=data.data;
           // this.scenic = data.data;
          }

        },
        error => {
          console.error(error);
        });
    }
    }
    if(this.placeNav[index].tit=='品味'){
      this.type=10;
      if(this.keywords==''){
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
          'keyword': this.keywords,
          'type': this.type
        }
      };
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
        data => {
          if (data && data.data) {
              // console.log(JSON.stringify(data.data));
              this.tasteList=data.data;
           // this.scenic = data.data;
          }

        },
        error => {
          console.error(error);
        });
    }
    }
    if(this.placeNav[index].tit=='景点'){
      this.type=11;
      if(this.keywords==''){
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
          'keyword': this.keywords,
          'type': this.type
        }
      };
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
        data => {
          if (data && data.data) {
              // console.log(JSON.stringify(data.data));
              this.item=data.data;
           // this.scenic = data.data;
          }

        },
        error => {
          console.error(error);
        });
    }
    }
    if(this.placeNav[index].tit=='场馆'){
      this.type=1;
      if(this.keywords==''){
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
          'keyword': this.keywords,
          'type': this.type
        }
      };
      this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
        data => {
          if (data && data.data) {
              // console.log(JSON.stringify(data.data));
              this.guanzhulist=data.data;
           // this.scenic = data.data;
          }

        },
        error => {
          console.error(error);
        });
    }
    }
  }
  toBack() {
    this.navCtrl.pop();
  }
}
