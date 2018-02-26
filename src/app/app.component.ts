import {Component, OnInit} from '@angular/core';
import {  Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import $ from 'jquery';
import {Md5} from "ts-md5/dist/md5";
import {UUID} from "angular2-uuid";
import {NavPage} from "../pages/nav/nav";
import {ROOT_URL} from "../providers/config";
import {appApis} from "../providers/apis";


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{

  rootPage:any =NavPage;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
  ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();
      //延迟隐藏闪屏 防止有白屏
      // setTimeout(() => {
      //   splashScreen.hide();
      // }, 1000);
    // localStorage.clear();
    });
  }
  ngOnInit(): void {
    this.getToken()
  }
  getToken(): void {
    const uuid = UUID.UUID().replace('-', '').replace( /-/g , '' );
    // let uuid = this.getUUID();
    const date = this.getDate();
    const secret = Md5.hashStr('**' + date + '##' + Md5.hashStr('qdzklt') + '##' + uuid + '**');
    let getStr = '{\'unique\':\'' + uuid + '\',\'secret\':\'' + secret + '\'}';
    getStr = this.replaceAll(getStr, '{', '%7B');
    getStr = this.replaceAll(getStr, '}', '%7D');
    getStr = this.replaceAll(getStr, ':', '%3A');
    getStr = this.replaceAll(getStr, '"', '%22');
    // let getStr = "%7B%27unique%27%3A" + uuid + ",%27secret%27%3A" + secret + "%7D";
    $.ajax({
      type: 'get',
      url: ROOT_URL+appApis.get_app_token+'?getStr=' + getStr,
      async: false,
      success: function (data) {
        data = eval('(' + data + ')');
        console.log('token', [data.data.token]);
        // if (data && data.code === 1) {
          localStorage.setItem('token', data.data.token);
        // }else {
        //   console.error(JSON.stringify(data));
        // }
      },
      error: function (data) {
        console.error(JSON.stringify(data));
      }
    });
  }

  /**
   * 替换字符串中所有的相同字符
   * @param string 原字符串
   * @param reg 匹配字符串
   * @param str 要替换成的字符串
   * @returns {string}
   */
  replaceAll(string, reg, str): string {
    return string.replace(new RegExp(reg, 'gm'), str);
  }

  getDate() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return y + '' + m + '' + d;
  }

}
