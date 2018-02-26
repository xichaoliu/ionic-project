import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import $ from 'jquery';
import {TasteDelPage} from "../taste-del/taste-del";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-taste',
  templateUrl: 'taste.html',
})
export class TastePage implements OnInit{
  isNum = 1;
  tasteClaID='';
  tasteList:any = [];
  tasteNav: any = [];
  msg;
  page: any = {
    pageIndex: 1,
    pageSeize: 10,
    pageTotal: 0
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,  private httpService: HttpServiceProvider) {
    this.getTastCla();
    this.getTastList('','');

  }
  ngOnInit(): void {

  }
  /*蒙版分类的隐藏与显示*/
  showMeng(){
    this.isNum ++;
    if(this.isNum%2==0){
      $('#navTit').css('display','block').css('height',$('#tasteBox').height()- $('.tastTit').height());
    }else{
      $('#navTit').css('display','none');
    }
  }
  getClassList(id) {
    this.tasteClaID = id;
    this.isNum ++;
    this.page.pageIndex = 1;
    this.tasteList = [];
    this.getTastList(this.tasteClaID,'');
    $('#navTit').css('display','none');
  }
  /*见闻分类列表*/
  getTastCla(){
    const getStr = {
      'type': '11002',
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data){
          this.tasteNav = data.data;
          this.tasteNav.unshift({id:'',name:'全部'});
        }
      },
      error => {
        console.error(error);
      });
  }
  doInfinite(infiniteScroll){
    this.getTastList(this.tasteClaID,infiniteScroll);
  }
  /*见闻列表*/
  getTastList(tasid,infScroll){
    const getStr = {
      'sorts':{
        'sort':'createtime',
        'order':'asc'
      },
      'pagesize': this.page.pageSeize ,
      'pagenum': this.page.pageIndex,
      'type': '11000',
      'filters':{
        'classifyid':tasid
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data) {
          if(infScroll){
            infScroll.complete();
          }
          if (this.page.pageIndex == 1) {
            this.tasteList = data.data;
          } else {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i]) {
                this.tasteList.push(data.data[i]);
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
        console.error(error);
      });
  }
  toTastDel(tastId){
    this.navCtrl.push(TasteDelPage,{tastId: tastId});
  }
}
