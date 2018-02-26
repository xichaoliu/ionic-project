import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import $ from 'jquery';
import {Subscription} from "rxjs/Subscription";
import {Coordination, Region} from "../../stateStore/log.store";
import {Store} from "@ngrx/store";
import {Geolocation} from "@ionic-native/geolocation";
import {MapSearchPage} from "../map-search/map-search";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import {CLEAR_STATUS} from "../../stateStore/action";

declare let BMap: any;

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements OnInit, OnDestroy {
  map: any;          // 创建地图实例
  color: string[] = ['#ff9623', '#0aa5ff', '#80d35d']; // 活动/场馆/景点标记点的的颜色
  v = 1; // color属性索引
  mapNav = [
    {id: 0, tit: '活动', port: '400004'},
    {id: 1, tit: '场馆', port: '300001'},
    {id: 2, tit: '景点', port: '1300001'}
  ]; // 底部导航栏
  portNow: any = '300001'; // 当前导航栏类型的接口type
  mapIndex = 1; // 控制底部导航栏切换
  eY: any;
  top: any;
  s: Subscription;
  sb: Subscription;
  location: any = null;// 当前定位城市
  DIT: any;// 弹出框top值
  conHeight: any; // 弹出框高度
  chosedLabel: any = null;//被选中点标记/文本标记
  labelArr: any = [];// 正常点标记/文本标记集合
  data: any; // 场馆/活动/景点数据
  isGps = false; // 回传给组件，控制导航图标的显示隐藏
  lonlat = {
    "lon": null,
    "lat": null
  }; // 当前调用接口所用坐标
  mylon: any;// 用户定位坐标
  mylat: any;
  chosedData: any = null; // 被选中点的数据
  marker: any = null; // 定位点/地图中心点图标
  canZoom = true; //控制定位标记缩放不消失
  canGps = false;
  isPresent = true;
  pushIn = false; // 判断map页面是否是从详情页点击导航进入的
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private store: Store<Region>,
              private st: Store<Coordination>,
              private httpService: HttpServiceProvider,
              public alertCtrl: AlertController,
              private geolocation: Geolocation) {
    this.pushIn = this.navParams.get('mp');// true
  }
  ngOnInit(): void {}
  ionViewDidLoad() {
    // 获取路由数据
    const that = this;
    this.DIT = Number.parseInt($('#con').css('top')); // 弹出框top值
    this.conHeight = Number.parseInt($('#con').css('height'));
    // 上拉框
    $('#map_drag').on('touchstart', function ($event) {
      that.eY = Number.parseInt($('#con').css('top'));
      if (that.eY >= that.DIT) {
        if (that.chosedData) {
          $('#con').animate({'top': '-256px'}, 1000);
        } else {
          $('#con').animate({'top': `-${that.conHeight}px`}, 1000);
        }
      } else {
        $('#con').animate({'top': `${that.DIT}px`}, 1000);
      }
    });
    const page = document.getElementById('container');
    const ch = document.body.clientHeight;
    page.setAttribute('style',
      `height:${ch}px;`);
    // 初始化地图并定位
    this.map = new BMap.Map("container");          // 创建地图实例
    this.mapEventBind(0);// 地图事件绑定
    this.getPosition(0); // 默认获取定位城市附近活动/场馆/景点信息
  }
  ionViewDidEnter() {
    this.subParam();
  }
  ionViewDidLeave() {
    this.store.dispatch({type: CLEAR_STATUS});// 重置store
    $('#con').animate({'top': `${this.DIT}px`}, 1000);
    this.sb.unsubscribe();
  }
  ngOnDestroy(): void {
    this.store.dispatch({type: CLEAR_STATUS});// 重置store
    if (this.s) {
      this.s.unsubscribe();// 取消订阅
    }
  }
  // 外部page传参数store绑定
  subParam() {
    this.sb = this.st.select(('cdt' as any)).subscribe((cod) => {
      if (cod.coord) {
        // alert(cod.coord);
        this.map.clearOverlays();
        this.gps(cod.coord);
        setTimeout(() => {
          this.pushIn = false;
        }, 3000)
      }
      if (cod.chosedData.item) {
        const cd = cod.chosedData.item.coordinates.split(',');
        let point = new BMap.Point(cd[0], cd[1]);  // 创建点坐标
        // console.log(JSON.stringify(point));
        this.map.setCenter(point);
        // this.map.centerAndZoom(point, 11);
        this.map.clearOverlays();
        this.mapIndex = cod.chosedData.id;
        this.addChosedtable(cod.chosedData.item);
        $('#con').animate({'top': '-256px'}, 1000); // 弹出框弹出
      }
    })
  }
  // 地图事件绑定
  mapEventBind(v) {
    const that = this;
    // 监听地图拖拽结束
    this.map.addEventListener('dragend', function () {
      if (that.canZoom && !that.canGps) {
        that.getCenter();
      }
    });
    // 监听地图缩放
    this.map.addEventListener('zoomend', function () {
      // console.log("地图缩放至：" + this.getZoom() + "级");
      if (that.canZoom && !that.canGps) {
        if (this.getZoom() >= 12) {
          that.addMapLabel2(that.v);
          if (that.chosedData) {
            that.addChosedText(that.chosedData[0]);
          }
        } else {
          that.addMapLabel(that.v);
          if (that.chosedData) {
            that.addChosedtable(that.chosedData[0]);
          }
        }
      }
    });
  }
  // 获取用户位置并获取初始数据
  getPosition(n) {
    const that = this;
    // let geolocation = new BMap.Geolocation();
    $('#con').animate({'top': `${this.DIT}px`}, 1000);
    this.geolocation.getCurrentPosition({timeout: 1000}).then((resp) => {
      // alert('地图定位成功');
      [that.lonlat.lon, that.mylon] = [resp.coords.longitude.toString(), resp.coords.longitude.toString()];
      [that.lonlat.lat, that.mylat] = [resp.coords.latitude.toString(), resp.coords.latitude.toString()];
      if (localStorage.getItem('lon')) {
        localStorage.lon = resp.coords.longitude.toString();
        localStorage.lat = resp.coords.latitude.toString();
      }
      // console.log('-----'+that.lonlat.lon+'===='+that.lonlat.lat);
      let geoc = new BMap.Geocoder();
      let pt = new BMap.Point(resp.coords.longitude, resp.coords.latitude);
      geoc.getLocation(pt, function (rs) {
        let addComp = rs.addressComponents;
        // alert(addComp.city );
        that.location = addComp.city; // 当前定位城市
      });
      if (n) {// 如果用户点击定位按钮，显示定位点
        // alert('dingwei ');
        that.map.clearOverlays();
        that.marker = null;
        that.marker = new BMap.Marker(pt);
        that.map.addOverlay(that.marker);
        that.map.panTo(pt);
        // that.canZoom = false;
        that.getData(that.lonlat.lon, that.lonlat.lat, that.v, that.portNow);// 默认获取场馆数据
      } else {
        that.marker = new BMap.Marker(pt);
        that.map.addOverlay(that.marker);
        that.subRegion();
      }
    }).catch((error) => {
      // alert('地图定失败');
      if (error.message == 'Illegal Access') {
        //用户拒绝,默认定位到济南
        if (n) {
          let alert = that.alertCtrl.create({
            title: '请开启位置权限',
          });
          alert.present();
        } else {
          that.regRegion();
        }
      } else {
        // 允许定位但定位失败
        that.bdPosition(n);
      }
    });
  }
  // 用户允许授予定位权限且定位成功订阅store
  subRegion() {
    const param = !!this.navParams.get('item');
    this.s = this.store.select(('region' as any)).subscribe((log) => {// 订阅
      if (this.location !== log.city && this.location != null && !param && log.city) {
        const if_switch = confirm(`当前定位城市为${this.location},是否切换`);
        if (if_switch) {
          // this.map.setCenter(log.city);.
          const that = this;
          if (!this.pushIn) this.map.centerAndZoom(log.city);
          this.map.addEventListener('load', function () {// load事件 这表示地图位置、缩放层级已经确定，但可能还在载入地图图块
            that.getCenter();// 待地图初始化结束后获取地图中心点附近活动/场馆/景点信息
          });
        } else {
          if (!this.pushIn) this.initMap(this.lonlat.lon, this.lonlat.lat);
          this.getData(this.lonlat.lon, this.lonlat.lat, 1, '300001');// 默认获取场馆数据
        }
      } else {
        if (!this.pushIn) this.initMap(this.lonlat.lon, this.lonlat.lat);
        this.getData(this.lonlat.lon, this.lonlat.lat, 1, '300001');// 默认获取场馆数据
      }
    });
  }
  // 允许定位但定位失败 调用百度地图定位
  bdPosition(n) {
    // alert('允许定位但定位失败');
    const that = this;
    function myFun(r) {
      [that.lonlat.lon, that.mylon] = [r.center.lng, r.center.lng];
      [that.lonlat.lat, that.mylat] = [r.center.lat, r.center.lat];
      if (localStorage.getItem('lon')) {
        localStorage.lon = r.center.lng;
        localStorage.lat = r.center.lat;
      } else {
        localStorage.setItem('lon', r.center.lng);
        localStorage.setItem('lat', r.center.lat);
      }
      that.location = r.name;
      // alert(JSON.stringify(r));
      let pt = new BMap.Point(r.center.lng, r.center.lat);
      // alert(JSON.stringify(pt));
      if (n) { // 如果用户点击定位按钮，显示定位点
        // alert('定位ddddd');
        that.map.clearOverlays();
        that.marker = null;
        that.marker = new BMap.Marker(pt);
        that.map.addOverlay(that.marker);
        that.map.panTo(pt);
        // that.canZoom = false;
        that.getData(that.lonlat.lon, that.lonlat.lat, that.v, that.portNow);// 默认获取场馆数据
      } else {
        that.marker = new BMap.Marker(pt);
        that.map.addOverlay(that.marker);
        that.subRegion();
      }
    }

    let myCity = new BMap.LocalCity();
    myCity.get(myFun);
  }
  // 用户拒绝授予定位权限
  regRegion() {
    this.s = this.store.select(('region' as any)).subscribe((log) => {// 订阅
      if (log && log.region_coords) {
        const coord = log.region_coords.split(',');
        [this.lonlat.lon, this.mylon] = [coord[0], coord[0]];
        [this.lonlat.lat, this.mylat] = [coord[1], coord[1]];
        if (!this.pushIn) {
          this.initMap(this.lonlat.lon, this.lonlat.lat);
          this.marker = new BMap.Marker(new BMap.Point(coord[0], coord[1])); // 创建地图点
          this.map.addOverlay(this.marker);
          this.getData(this.lonlat.lon, this.lonlat.lat, 1, '300001');// 默认获取场馆数据
        }
      }
    });
  }
  // 初始化地图中心点
  initMap(lon, lat) {
    let point = new BMap.Point(lon, lat);  // 创建点坐标
    this.map.centerAndZoom(point, 11);
  }
  // 获取地图中心点
  getCenter() {
    if (this.marker) {
      this.map.removeOverlay(this.marker);
    }
    this.marker = null;
    const ct = this.map.getCenter();
    this.lonlat.lon = ct.lng;
    this.lonlat.lat = ct.lat;
    this.marker = new BMap.Marker(new BMap.Point(ct.lng, ct.lat)); // 创建点
    this.map.addOverlay(this.marker);
    this.getData(ct.lng, ct.lat, this.v, this.portNow);// 默认获取地图中心点附近场馆数据
  }
  // zoom <= 12时向地图添加圆点标注
  addMapLabel(v) {
    this.map.clearOverlays(); //清除所有覆盖物
    this.map.addOverlay(this.marker);
    this.labelArr = [];
    if (this.data) {
      const l = this.data.length;
      for (let i = 0; i < l; i++) {
        this.addLabel(this.data[i], v);
      }
    }
  }
  addLabel(item, v) {
    const that = this;
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0], lola[1])
    };
    let label = new BMap.Label(' ', option);  // 创建文本标注对象
    label.setStyle({
      position: 'absolue',
      color: "white",
      backgroundColor: this.color[v],
      height: "0.403rem",
      width: "0.403rem",
      opacity: 1,
      textAlign: "center",
      borderWidth: '.048rem',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      borderRadius: "50%",
      zIndex: '1',
    });
    label.addEventListener('click', function () {
      that.map.removeOverlay(that.chosedLabel);// 删除单个标记点
      // const firstH = Number.parseInt($('.map-box').css('height'));
      // const mT =Number.parseInt($('.map-box').css('margin-top'));
      $('#con').animate({'top': '-256px'}, 1000);
      that.addChosedtable(item);
    });
    this.map.addOverlay(label);
    this.labelArr.push(label);
    this.map.getPanes();
    // console.log('覆盖物集合',JSON.stringify(arrOver));
  }
  // zoom > 12时向地图添加文本标注
  addMapLabel2(v) {
    this.map.clearOverlays(); //清除所有覆盖物
    this.map.addOverlay(this.marker);
    this.labelArr = [];
    if (this.data) {
      const l = this.data.length;
      for (let i = 0; i < l; i++) {
        this.addLabel2(this.data[i], v);
      }
    }
  }
  addLabel2(item, v) {
    const that = this;
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0], lola[1])
    };
    let text2 = item.name?item.name:item.title;
    let label = new BMap.Label(text2, option);  // 创建文本标注对象
    label.setStyle({
      position: 'absolue',
      color: "white",
      fontSize: "0.402rem",
      backgroundColor: this.color[v],
      borderRadius: "10%",
      padding: '0.1rem',
      border: 'none',
      zIndex: '1',
    });
    label.addEventListener('click', function () {
      that.map.removeOverlay(that.chosedLabel);// 删除单个标记点
      $('#con').animate({'top': '-256px'}, 1000);
      that.addChosedText(item);
    });
    this.map.addOverlay(label);
    this.labelArr.push(label);
  }
  // 被选中点
  addChosedtable(item) {
    this.isGps = true;
    this.chosedData = null;
    this.chosedLabel = null;
    this.chosedData = [item];
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0], lola[1])
    };
    this.chosedLabel = new BMap.Label(' ', option);  // 创建文本标注对象
    this.chosedLabel.setStyle({
      position: 'absolue',
      color: "white",
      backgroundImage: "url('assets/imgs/map.png')",
      backgroundSize: "cover",
      height: "0.403rem",
      width: "0.403rem",
      opacity: 1,
      textAlign: "center",
      borderWidth: '.048rem',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      borderRadius: "50%",
      zIndex: '100',
    });
    this.map.addOverlay(this.chosedLabel);
  }
// 被选中文本
  addChosedText(item) {
    this.isGps = true;
    this.chosedData = null;
    this.chosedLabel = null;
    this.chosedData = [item];
    const lola = item.coordinates.split(',');
    let option = {
      position: new BMap.Point(lola[0], lola[1])
    };
    let text = item.name?item.name:item.title;
    this.chosedLabel = new BMap.Label(text, option);  // 创建文本标注对象
    this.chosedLabel.setStyle({
      position: 'absolue',
      color: "white",
      fontSize: "0.402rem",
      padding: '0.1rem',
      backgroundColor: 'red',
      borderRadius: "10%",
      zIndex: '100',
    });
    this.map.addOverlay(this.chosedLabel);
  }
  // 活动/场馆/景点切换
  switchOver(m) {
    this.initMap(this.lonlat.lon, this.lonlat.lat);
    this.canGps = false;
    this.isGps = false;
    this.mapIndex = m.id;
    this.chosedData = null;
    this.canZoom = true;
    if (m.port) {
      this.portNow = m.port;
      this.getData(this.lonlat.lon, this.lonlat.lat, m.id, m.port);
    }
  }
  // 获取活动/ 场馆/ 景点数据
  getData(lon, lat, v, port) {
    if (this.pushIn) {
      return;
    }
    this.data = null;
    this.v = v;
    const pageStr = {
      "type": port,
      "filters": {
        "lon": lon,
        "lat": lat,
        "distance": 100
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(pageStr),
      data => {
        // alert('地图获取数据成功');
        if (data.code === 1) {
          // console.log('huoqushuju', JSON.stringify(data.data));
          this.data = data.data;
          if (this.map.getZoom() >= 12) {
            this.addMapLabel2(v);
            if (this.chosedData) {
              this.addChosedText(this.chosedData[0]);
            }
          } else {
            this.addMapLabel(v);
            if (this.chosedData) {
              this.addChosedtable(this.chosedData[0]);
            }
          }
        } else {
          if (this.canZoom && !this.canGps) {
            this.map.clearOverlays(); //清除所有覆盖物
            this.map.addOverlay(this.marker);
          }
          $('#con').animate({'top': `${this.DIT}px`}, 1000);
        }
      },
      error => {
        // alert('地图获取数据失败');
        console.log('请求错误', JSON.stringify(error));
      })
  }
  // 导航
  gps(coord) {
    $('#con').animate({'top': `${this.DIT}px`}, 1000);
    this.map.clearOverlays();
    const lola = (coord as string).split(',');
    // console.log(lola[0]+'---'+lola[1]);
    let p1 = new BMap.Point(lola[0], lola[1]);
    this.mylon = localStorage.getItem('lon');
    this.mylat = localStorage.getItem('lat');
    let p2 = new BMap.Point(this.mylon, this.mylat);

    let driving = new BMap.DrivingRoute(this.map, {renderOptions: {map: this.map}});
    driving.search(p2, p1);
    this.canGps = true;
  }
  // 回到上一页
  back() {
    this.navCtrl.pop();
  }
  // 跳转到搜索页面
  toMapSearch() {
    this.navCtrl.push(MapSearchPage, {
      'lon': this.lonlat.lon,
      'lat': this.lonlat.lat
    });
  }
}
