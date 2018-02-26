import { Component, Input, Output, EventEmitter } from '@angular/core';
import { appApis } from '../../providers/apis';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ToastController, NavController } from 'ionic-angular';
import { PlaceDelPage } from '../../pages/place-del/place-del';


/**
 * Generated class for the VenueComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'venue',
  templateUrl: 'venue.html'
})
export class VenueComponent {
  @Input() guanzhulist;
  @Output() cancle= new EventEmitter();
  text: string;
  public id:any;
  constructor(public navCtrl: NavController,private httpService: HttpServiceProvider,private toastCtrl: ToastController,) {
    // console.log('Hello VenueComponent Component');
    this.text = 'Hello World';
  }
    /*场馆主页*/
    toplaceDel(stationID, stationType){
      this.navCtrl.push(PlaceDelPage, {stationID: stationID, stationType:stationType});
    }
  quxiao(id){
       /*取消光柱*/

       const getStr = {
        'type': '0009',
         'key':id,
         'operate':'R'
         };
      this.httpService.get(appApis.get_app_data + '?postStr=' + JSON.stringify(getStr),
        data => {
          // console.log(data.data);
          if(data.data==''){
            this.cancle.emit(data.msg);
            let toast = this.toastCtrl.create({
              message: '取消关注成功',
              duration: 2000,
              position: 'top'
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
