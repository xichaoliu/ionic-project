import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {appApis} from '../../providers/apis';
import {HttpServiceProvider} from '../../providers/http-service/http-service';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  public orderlsit:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService: HttpServiceProvider) {
  }

  ionViewDidLoad() {
    this.getOrderList();
  }
  /*见闻列表*/
  getOrderList(){
    // console.log(111);
    const getStr = {
      'type': '4002',
      'filters':{
            'id':localStorage.getItem('usid'),
      }

    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getStr),
      data => {
        // console.log(JSON.stringify(data));
        if (data && data.data){
          this.orderlsit = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  toBack() {
    this.navCtrl.pop();
  }

}
