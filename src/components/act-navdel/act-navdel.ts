import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
declare let Swiper: any;
import $ from 'jquery';

@Component({
  selector: 'act-navdel',
  templateUrl: 'act-navdel.html'
})
export class ActNavdelComponent implements OnInit {
  actIndex = '';
  navList: any = [];
  @Input() toNav;
  @Output() recAct= new EventEmitter();
  constructor(public navCtrl: NavController, private httpService: HttpServiceProvider) {

  }
  ionViewDidEnter(){
    setTimeout(() => {
      $('.swiper-wrapper').css('transform','translate3d(0,0,0)')
    })
  }
  ngOnInit(): void {
    this.getActCla();

   new Swiper('.swiper-container', {
      observer: true, // 修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, // 修改swiper的父元素时，自动初始化swiper
      slidesPerView: 'auto',
      paginationClickable: true,
      spaceBetween: 10
    });
    setTimeout(() => {
      $('.swiper-wrapper').css('transform','translate3d(0,0,0)')
    },50)
  }

  getData(id) {
    this.actIndex = id;
    this.recAct.emit(id);
  }
// 获得活动分类
  getActCla() {
    this.navList = [];
    const getStr = '?getStr={\'type\':\'400001\'}';
    this.httpService.get(appApis.get_app_data + getStr,
      data => {
        if (data) {
          this.navList = data.data;
          this.navList.unshift({id:'',name:'全部'});
        }
      },
      error => {
        console.error(error);
      });
  }
}
