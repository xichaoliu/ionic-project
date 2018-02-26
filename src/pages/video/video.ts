import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

declare let CKobject: any;
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  videoId;
  videoDel: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.videoId = navParams.data.videoId;
  }
  ionViewDidLoad() {
    this.getLiveDetail();
  }
  // 获得对应的活动详情
  getLiveDetail() {
    const getStr = {
      'type': '4001',
      'filters': {
        'accid': localStorage.getItem('usid'),
        'id': this.videoId
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data) {
          this.videoDel = data.data;
          // console.log(this.videoDel.hls);
          const a = encodeURI(this.videoDel.hls);
          this.playVideo(a,this.videoDel.pic);
        }
      },
      error => {
        console.error(error);
      });
  }
  /**
   *rtmp直播流播放器
   * @param url 直播视频流地址
   */
  playVideo(url,pic){
    let flashvars={
      f:'m3u8.swf',
      a:url,
      i:pic,
      s:4,
      c:0
    };
    let params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
    let video=[url];
    CKobject.embed('/ckplayer/ckplayer.swf','live_video','ckplayer_a1','100%','100%',false,flashvars,video,params);
  }
  toBack() {
    this.navCtrl.pop();
  }
}
