import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {NavController} from "ionic-angular";
import {ScenDelPage} from "../../pages/scen-del/scen-del";

declare let BMap:any;

@Component({
  selector: 'map-landscape',
  templateUrl: 'map-landscape.html'
})
export class MapLandscapeComponent implements OnChanges{
@Input() item:any;
@Input() isGps:any = false;
@Input() lMap2:any;
@Output() onGps2 = new EventEmitter<any>();
distance2 = null;
  constructor(public navCtrl: NavController) {
  }
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
      this.distance2 = (this.lMap2.getDistance(pointA,pointB)/1000).toFixed(1) ; //获取两点距离,保留小数点后两位
      // let polyline = new BMap.Polyline([pointA,pointB], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
      // this.lMap.addOverlay(polyline);     //添加折线到地图上
    }else {
      this.distance2 = null;
    }
  }
  toNav1(item) {
    this.onGps2.emit(item);
  }
  toLandDel(id) {
    this.navCtrl.push(ScenDelPage,{scenicID: id});
  }
  // 获取距离
//   getDistance(lat1,lng1,lat2,lng2) {
//     function GetDistance( lat1,  lng1,  lat2,  lng2){
//       let radLat1 = lat1*Math.PI / 180.0;
//       let radLat2 = lat2*Math.PI / 180.0;
//       let a = radLat1 - radLat2;
//       let  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
//       let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
//         Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
//       s = s *6378.137 ;// EARTH_RADIUS;
//       s = Math.round(s * 10000) / 10000;
//       return s;
//     }
// // 调用 return的距离单位为km
//    return GetDistance(lat1,lng1,lat2,lng2);
//   }
}
