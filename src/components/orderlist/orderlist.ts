import {Component, Input} from '@angular/core';
import {appApis} from '../../providers/apis';
import {HttpServiceProvider} from '../../providers/http-service/http-service';
import {AlertController, NavController, ToastController} from 'ionic-angular';
import {AppraiseSubmitPage} from '../../pages/appraise-submit/appraise-submit';
import {ReverseDelPage} from "../../pages/reverse-del/reverse-del";

/**
 * Generated class for the OrderlistComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'orderlist',
  templateUrl: 'orderlist.html'
})
export class OrderlistComponent {
  public ReverseDelPage = ReverseDelPage;
  text: string;
  @Input() orderlist;
  constructor(private alertCtrl: AlertController,private toastCtrl: ToastController,private httpService: HttpServiceProvider, public navCtrl: NavController) {
    // console.log('Hello OrderlistComponent Component');
    this.text = 'Hello World';
  }
  pingjia(id, name){
    // console.log('订单id', id)
    this.navCtrl.push(AppraiseSubmitPage,{valueID:id,valueName:name});
  }
  toReserDel(resDelID){
    this.navCtrl.push(ReverseDelPage, {resDelID:resDelID});

  }
  quxiao(id){
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '确定要取消此订单吗?',
      buttons: [
        {
          text: '取消',

          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            // console.log('Buy clicked');
            const getStr = {
              'type': '4004',
              'key':id,
              'operate':'M'
            };
            this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(getStr),
              data => {
              // console.log(data.data);
                if (data && data.data) {
                  let toast = this.toastCtrl.create({
                    message: data.msg,
                    duration: 3000,
                    position: 'middle'
                  });

                  toast.onDidDismiss(() => {
                    // console.log('Dismissed toast');
                  });

                  toast.present();
                }else{
                  let toast = this.toastCtrl.create({
                    message: data.msg,
                    duration: 3000,
                    position: 'middle'
                  });

                  toast.onDidDismiss(() => {
                    // console.log('Dismissed toast');
                  });

                  toast.present();
                }
              },
              error => {
                console.error(error);
              });
          }
        }
      ]
    });
    alert.present();

  }
}
