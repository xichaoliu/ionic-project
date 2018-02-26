import {Component, EventEmitter, Input, Output,OnChanges,SimpleChanges} from '@angular/core';
import {PlaceDelPage} from "../../pages/place-del/place-del";
import {NavController} from "ionic-angular";
declare let BMap:any;
/**
 * Generated class for the MapPlaceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-place',
  templateUrl: 'map-place.html'
})
export class MapPlaceComponent implements OnChanges{
@Input()  item:any=null;
@Input() isGps = false;
@Input() lMap:any;
@Output() onGps = new EventEmitter<any>();
  distance = null;
  constructor(public navCtrl: NavController) {}
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isGps) {
      const lng1 = localStorage.getItem('lon');
      const lat1 = localStorage.getItem('lat');
      const coord2 = this.item.coordinates.split(',');
      const lng2 = coord2[0];
      const lat2 = coord2[1];
      // this.distance = this.getDistance(Number(lat1),Number(lng1),Number(lat2),Number(lng2));
      let pointA = new BMap.Point(lng1,lat1);  // 创建点坐标A
      let pointB = new BMap.Point(lng2,lat2);  // 创建点坐标B
      this.distance = (this.lMap.getDistance(pointA,pointB)/1000).toFixed(1) ; //获取两点距离,保留小数点后两位
      // let polyline = new BMap.Polyline([pointA,pointB], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
      // this.lMap.addOverlay(polyline);     //添加折线到地图上
    }else {
      this.distance = null;
    }
  }
  // 导航
  toNav(item) {
    this.onGps.emit(item);
  }
  // 跳转详情
  toDetail(item) {
    this.navCtrl.push(PlaceDelPage,{stationID:item.id, stationType:item.type});
  }
}
