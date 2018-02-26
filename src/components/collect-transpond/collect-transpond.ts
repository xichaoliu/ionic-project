import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';
import {AlertController} from 'ionic-angular';
import {QQSDK, QQShareOptions} from "@ionic-native/qqsdk";

declare let Wechat;
declare let window:any;
@Component({
  selector: 'collect-transpond',
  templateUrl: 'collect-transpond.html'
})
export class CollectTranspondComponent implements OnInit{
  @Input() colDel = null;
  @Input() type;
  @Output() reCollect= new EventEmitter();
  aH:any;
  cH:any;
  ss = false;

  constructor( private httpService: HttpServiceProvider,
    private alertCtrl: AlertController,
    private qq:QQSDK,

    ) {

  }
  ngOnInit(): void {
  this.cH = document.body.clientHeight;// 设备高度
  }
  // 收藏
  isCollect(id,type) {
    // console.log(id);
    if (localStorage.getItem('usid')) {
      const postStr = {
        'type': '0009',
        'data': {
          'accid': localStorage.getItem('usid'),
          'bizid': id,
          'type': this.type,
        },
        'operate': 'A'
      };
      // console.log(postStr);
      this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
        data => {
          if (data) { }},
        error => {
          if (error) {
            // console.log(JSON.stringify(error));
            if (error.code === 1) {
              this.reCollect.emit(error.msg);
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '收藏成功',
                buttons: ['确定']
              });
              alert.present();
            }else {
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: '收藏失败',
                buttons: ['确定']
              });
              alert.present();
            }
          }
        });
    }else {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '请先登录',
        buttons: ['确定']
      });
      alert.present();
    }
  }
  // 取消收藏
  noCollect(collection_id,collect_id) {
    let postStr ={};
    if(collection_id){
       postStr = {
        'type': '0009',
        'key': collection_id,
        'operate': 'R'
      };
    }else{
       postStr = {
        'type': '0009',
        'key': collect_id,
        'operate': 'R'
      };
    }
    this.httpService.post(appApis.get_app_data + '?postStr=' + JSON.stringify(postStr),
      data => {
        if (data) {
        }
      },
      error => {
        // console.log(error);
        if (error) {
          if (error.code === 1) {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '您已取消收藏',
              buttons: ['确定']
            });
            alert.present();
            this.reCollect.emit(error.msg) ;
          }else {
            let alert = this.alertCtrl.create({
              title: '提示信息',
              subTitle: '取消收藏失败',
              buttons: ['确定']
            });
            alert.present();

          }
        }
      });
  }
  // 转发
  share() {
    this.ss = true;
    setTimeout(()=>{
      this.aH = Number.parseInt($('#share-content').css('height'));
      $('#share-content').animate({'top':`${this.cH - this.aH}px`},500);
    });
  }
  /**
   * 微信分享
   *
   * @param scene 0：朋友; 1:朋友圈; 2: 收藏夹;
   */

  weChatShare(scene){

    Wechat.share({
      message: {
        title: this.colDel.title,
        description: this.colDel.description,// 分享给好友会显示描述
        media: {
          type: Wechat.Type.WEBPAGE,
          webpageUrl: "http://www.wenmind.com/"
        }
      },
      scene: scene
    }, function () {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '分享成功',
        buttons: ['确定']
      });
      alert.present();
    }, function (reason) {
      let alert = this.alertCtrl.create({
        title: '提示信息',
        subTitle: '分享失败',
        buttons: ['确定']
      });
      alert.present();
    });
  }
  // qq分享
  qqShare() {
    // alert('qq分享');

    const options: QQShareOptions = {
      client: this.qq.ClientType.QQ,
      scene: this.qq.Scene.QQ,
      title: this.colDel.title,
      url: 'http://www.wenmind.com/',
      image: this.colDel.pic,
      description: this.colDel.description,
      // flashUrl:  'http://stream20.qqmusic.qq.com/30577158.mp3',
    };
    this.qq.shareNews(options)
      .then(() => {
        console.log('shareImage success');
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 微博分享
  weiboShare() {
    console.log(window.weibo);
  //   window.weibo.init('4132404101','http://www.example.com/callback.html');
  //   window.weibo.share({
  //     type: 'image',
  //     data: 'http://ww3.sinaimg.cn/large/77565b1bjw1eqd6s01q6ej20c80c80t4.jpg',
  //     text: 'test my plugin'
  // },function(res){
  //     console.log(res);
  // });
  }
  // 取消分享
  cancelShare() {
    $('#share-content').animate({'top':`100%`},500);
    setTimeout(()=>{
      this.ss = false;
    },500);
  }
}
