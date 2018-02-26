import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Store} from "@ngrx/store";
import {Region} from "../../stateStore/log.store";
import {REGION_CODE, REGION_COORDS, REGION_SWITCH} from "../../stateStore/action";

@Component({
  selector: 'page-switch-city',
  templateUrl: 'switch-city.html',
})
export class SwitchCityPage {
  options = null;
  gpsCity:any = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<Region>,
    ) {
   this.options = this.navParams.get('item');
  }

  ionViewDidLoad() {
    if(localStorage.getItem('gps')){
      this.gpsCity =localStorage.getItem('gps');
    }
  }
  back() {
    this.navCtrl.pop();
  }
  sendCity(v) {
    const coord = v.longitude+','+v.latitude;
    this.store.dispatch({type: REGION_CODE, payload: v.regional_code});
    this.store.dispatch({type: REGION_COORDS, payload: coord});
    this.store.dispatch({type: REGION_SWITCH, payload: v.regional_name});
    this.navCtrl.pop();
  }
}
