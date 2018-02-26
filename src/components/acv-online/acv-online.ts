import { Component, OnInit, Input } from '@angular/core';

import { NavController } from 'ionic-angular';
import { VideoPage } from '../../pages/video/video';
declare let Swiper: any;
@Component({
  selector: 'acv-online',
  templateUrl: 'acv-online.html'
})
export class AcvOnlineComponent implements OnInit {



  @Input() liveList;
  constructor(public navCtrl: NavController,) {

  }
  ngOnInit(){
    setTimeout(() => {
      new Swiper ('#online', {
        slidesPerView: 2,
        })
    }, 500);

  }
  toActDel(id) {
    this.navCtrl.push(VideoPage, {videoId:id});
  }
}
