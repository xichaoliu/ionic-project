import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import {AppVersion} from "@ionic-native/app-version";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener} from "@ionic-native/file-opener";
import {File} from '@ionic-native/file';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {
  version;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appVersion: AppVersion,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    private alertCtrl: AlertController,
    private httpService: HttpServiceProvider,

  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.appVersion.getVersionNumber().then((version: string) => {
        // console.log('version',version);
        this.version = version;
      }).catch(err => {
        // console.log('getVersionNumber:' + err);
      });
    });
  }

  ionViewDidLoad() {}
  /*更新*/
  update(){
    this.getAppVersion(this.version);
  }
  getAppVersion(version) {
    const getStr = {
      'type': '6004'
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        // console.log(JSON.stringify(data));
        if (data.code) {
            if (data.data.version != null && data.data.version !== this.version) {
              this.detectionUpgrade(data.data.url, true); //提示升级
            }else{
              this.alertCtrl.create({
                title: '升级提示',
                subTitle: '当前版本已是最新版本',
                buttons: [{
                  text: '确定'
                }]
              }).present();
            }
        }
      },
      error => {
        console.error(JSON.stringify(error));
      });
  }

  /*j检测app提示是否升级*/
  detectionUpgrade(apkUrl, allowChoose) {
    if (allowChoose) {
      this.alertCtrl.create({
        title: '升级提示',
        subTitle: '发现新版本,是否立即升级？',
        buttons: [{
          text: '取消'
        }, {
          text: '确定',
          handler: () => {
            this.downloadApp(apkUrl);
          }
        }]
      }).present();
    } else {
      this.downloadApp(apkUrl);
    }
  }
  /*下载安装app*/
  downloadApp(apkUrl) {
    let alert = this.alertCtrl.create({
      title: '下载进度：0%',
      enableBackdropDismiss: false,
      buttons: ['后台下载']
    });
    alert.present();

    const fileTransfer: FileTransferObject = this.transfer.create();
    const apk = this.file.externalRootDirectory  + 'app.apk'; //apk保存的目录
    fileTransfer.download(apkUrl, apk).then(() => {
      this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() =>{
        // console.log('File is opened')
      }).catch(e => {
        // console.log('Error openening file', e)
      });
    });
    fileTransfer.onProgress((event: ProgressEvent) => {
      let num = Math.floor(event.loaded / event.total * 100);
      if (num === 100) {
        alert.dismiss();
      } else {
        let title = document.getElementsByClassName('alert-title')[0];
        title && (title.innerHTML = '下载进度：' + num + '%');
      }
    });
  }
  toBack() {
    this.navCtrl.pop();
  }
}
