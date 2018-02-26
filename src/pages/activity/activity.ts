import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ActOnlinePage} from "../act-online/act-online";
import {CalendarPage} from "../calendar/calendar";
import {appApis} from "../../providers/apis";
import {ActDetailPage} from "../act-detail/act-detail";


@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})

export class ActivityPage implements OnInit{
  actList: any = [];
  actClassId;
  msg;
  navIndex = 0;
  page: any = {
    pageIndex: 1,
    pageSeize: 10,
    pageTotal: 0
  };
  // items = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {

  }
  ngOnInit(): void {
    this.getActList('');
  }
  doInfinite(infiniteScroll){
    // console.log('Begin async operation');
    this.getActList(infiniteScroll);
  }
  /*子组件传的navID*/
  resActCla($event) {
    this.actClassId = $event;
    this.actList=[];
    this.page.pageIndex =1
    this.getActList('');
  }
  // 获得活动列表数据
  getActList(infScroll){
    let getPageStr = {
      'sorts':{
        'sort':'status',
        'order':'asc'
      },
      'pagesize': this.page.pageSeize ,
      'pagenum': this.page.pageIndex,
      'type':'4000',
      'filters':{
        'classifyid': this.actClassId,
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr='+ JSON.stringify(getPageStr),
      data => {
        // console.log('活动请求',data);
        if (data && data.data) {
          if(infScroll){
            infScroll.complete();
          }
          if (this.page.pageIndex == 1) {
            this.actList = data.data;
          } else {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i]) {
                this.actList.push(data.data[i]);
              }
            }
          }
          this.page.pageIndex += 1;
        }else{
          if(infScroll){
            infScroll.enable(false)
          }
          this.msg='暂无更多数据'
        }
      },
      error => {
      alert('活动请求失败');
        console.error(error);
      });
  }



  toActOnline(tit){
    this.navCtrl.push(ActOnlinePage, {title: tit});
  }
  toCalendar(){
    this.navCtrl.push(CalendarPage);
  }
  toActDel(id){
    this.navCtrl.push(ActDetailPage, {actid:id});
  }
}
