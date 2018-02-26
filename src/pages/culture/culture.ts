import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {TasteDelPage} from "../taste-del/taste-del";
import {ActDetailPage} from "../act-detail/act-detail";
import {Store} from "@ngrx/store";
import {Region} from "../../stateStore/log.store";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-culture',
  templateUrl: 'culture.html',
})
export class CulturePage implements OnInit, OnDestroy {

  @ViewChild(Slides) slides: Slides;
  @Output() showTast= new EventEmitter();
  orgY: any;
  sY: any;
  lunbTopList: any = [];
  tasteList: any = [];
  liveList: any = [];
  actList: any = [];
  regCode: any = null;
  page: any = {
    pageIndex: 1,
    pageSeize: 10,
    pageTotal: 0
  };
  msg;
  s: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpService: HttpServiceProvider,
              private store: Store<Region>) {
    this.s = this.store.select(('region' as any)).subscribe((log) => {
      if (log.region_code !== this.regCode) {
        this.page.pageIndex = 1;
        this.actList = [];
        this.regCode = log.region_code;
        this.getLunTopList();
        this.getTastList();
        this.getActList();
        this.getLiveList();
      }
    });
  }
  doInfinite(infiniteScroll) {
    let getPageStr = {
      'sorts': {
        'sort': 'status',
        'order': 'asc'
      },
      'filters': {
        'regional_code': this.regCode
      },
      'pagenum': this.page.pageIndex,
      'pagesize': this.page.pageSeize,
      'type': '4000'
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getPageStr),
      data => {
        if (data && data.data) {

          // console.log('活动数据', data.data)
          if (this.page.pageIndex == 1) {

            this.actList = [];

            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i]) {
                this.actList.push(data.data[i]);
              }
            }
          } else {

            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i]) {
                this.actList.push(data.data[i]);
              }
            }
          }
          this.page.pageIndex += 1;
          //页码加1
          infiniteScroll.complete();
          // console.log('Async operation has ended');
        } else {
          infiniteScroll.enable(false)
          this.msg = '暂无更多数据'
        }
      },
      error => {
        console.error(error);
      });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.s.unsubscribe();
  }



  // 加载轮播图
  getLunTopList() {
    const param = {
      'type': 12000,
      'filters': {
        'classify_id': 370000,
        'limit': 5
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(param),
      data => {
        // console.log(data);
        if (data.data) {
          this.lunbTopList = data.data;
        }
      },
      err => {
        console.error(err);
      });
  }

  /*见闻列表*/
  getTastList() {
    const getStr = {
      'type': '11000',
      'filters': {
        'regional_code': this.regCode
      },
      'pagesize': 3
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log(data);
        if (data && data.data) {
          this.tasteList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  /*直播活动列表 4000*/
  getLiveList() {
    const getStr = {
      'type': '4000',
      'sorts': {
        'sort': 'status',
        'order': 'asc'
      },
      'pagenum': this.page.pageIndex,
      'pagesize': this.page.pageSeize,
      'filters': {
        'l_status': 1,
        'regional_code': this.regCode
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log('直播活动', data);
        if (data && data.data) {
          this.liveList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }

  // 获得活动列表数据
  getActList() {
    // console.log('页码', this.page.pageIndex);
    let getPageStr = {
      'sorts': {
        'sort': 'status',
        'order': 'asc'
      },
      'filters': {
        'regional_code': this.regCode
      },
      'pagenum': this.page.pageIndex,
      'pagesize': this.page.pageSeize,
      'type': '4000'
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getPageStr),
      data => {

        if (data && data.data) {
          // console.log('活动数据', data.data)
          if (this.page.pageIndex == 1) {
            this.actList = [];
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i]) {
                this.actList.push(data.data[i]);
              }
            }
          } else {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i]) {
                this.actList.push(data.data[i]);
              }
            }
          }
          this.page.pageIndex += 1;
          //页码加1
        } else {
          this.msg = '暂无数据'
        }
      },
      error => {
        console.error(error);
      });
  }

  slideChanged() {

  }

  autoplay() {
  }

  opentast() {
    this.showTast.emit('true');
  }

  toTastDel(tasteId) {
    this.navCtrl.push(TasteDelPage, {tastId: tasteId});
  }

  toActDel(id) {
    this.navCtrl.push(ActDetailPage, {actid: id});
  }

}
