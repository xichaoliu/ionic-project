import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ActDetailPage} from "../../pages/act-detail/act-detail";
import {NavController} from "ionic-angular";
declare let BMap:any;
/**
 * Generated class for the MapActiveComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-active',
  templateUrl: 'map-active.html'
})
export class MapActiveComponent implements OnChanges{
@Input() item:any;
@Input() isGps:any = false;
@Input() lMap1:any;
@Output() onGps1 = new EventEmitter<any>();
distance1 = null;
data:any;
time:any;

  constructor(public navCtrl: NavController) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    const arr = this.item.starttime.split(' ');
    this.data = arr[0].split('-').slice(1).join('.');
    this.time = arr[1].split(':').slice(0,2).join(':');
    if(this.isGps) {
      const lng1 = localStorage.getItem('lon');
      const lat1 = localStorage.getItem('lat');
      const coord2 = this.item.coordinates.split(',');
      const lng2 = coord2[0];
      const lat2 = coord2[1];
      // this.distance = this.getDistance(Number(lat1),Number(lng1),Number(lat2),Number(lng2));
      let pointA = new BMap.Point(lng1,lat1);  // 创建点坐标A
      let pointB = new BMap.Point(lng2,lat2);  // 创建点坐标B
      this.distance1 = (this.lMap1.getDistance(pointA,pointB)/1000).toFixed(1) ; //获取两点距离,保留小数点后两位
      // let polyline = new BMap.Polyline([pointA,pointB], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
      // this.lMap.addOverlay(polyline);     //添加折线到地图上
    }else {
      this.distance1 = null;
    }
  }
  toActDel(id) {
    // this.navCtrl.pop();
    this.navCtrl.push(ActDetailPage,{actid:id});
  }
  toNav2(item) {
    this.onGps1.emit(item);
  }
}
