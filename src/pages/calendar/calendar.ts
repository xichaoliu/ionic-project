import {Component, OnInit} from '@angular/core';
import $ from 'jquery'
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {appApis} from "../../providers/apis";
import {NavController} from "ionic-angular";
import {ActDetailPage} from "../act-detail/act-detail";

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnInit{
  Year = new Date().getFullYear();
  Month = new Date().getMonth()+1;
  activedDate:any = null; // 当月存在活动的日期集合
  arr = [];
  cs = false;
  // 拖拽
  orgY: any;
  sY: any;
  today:any;
  toMonth:any;
  toYear:any;
  actList:any; // 活动列表
  num:any = 0; // 当月周数
  isBind = false;// 判断是否为活动列表绑定了事件
  constructor(private httpService: HttpServiceProvider,private navCtrl: NavController) {
  }
  ionViewDidLoad() {
    const dd = new Date();
    this.today = dd.getDate();
    this.toMonth = dd.getMonth()+1;
    this.toYear = dd.getFullYear();
    this.Month = dd.getMonth()+1;
    this.Year = dd.getFullYear();
    if(this.toMonth<10){
      (this.toMonth as any) = '0'+this.toMonth;
    }
    if(this.Month<10){
      (this.Month as any) = '0'+this.Month;
    }
    const param = this.toYear+'-'+this.toMonth;
    this.getActivedDate(param);
  }
  ngOnInit(): void {
  }
  // 获取存在活动的日期集合
  getActivedDate(param) {
    this.activedDate = null;
    const str = {
      "type":"400005",
      "filters": {
        "date":param
      }
    };
    this.httpService.get(appApis.get_app_data+'?getStr='+JSON.stringify(str),
      data => {
        if(data.code === 1){
          this.activedDate = data.data.days;
        }
        this.createCalendar();
      },
      error=> {
        console.log(JSON.stringify(error));
        this.createCalendar();
      })
  }
  // 创建日历
 createCalendar() {
   this.arr = [];
  let date = new Date();
   // 设置显示的年月和当月第一天
   date.setFullYear(this.Year);
   date.setMonth(this.Month-1);
   date.setDate(1);
   let f_week = date.getDay();
  let f ,i,num=0;
  const totalDay = CalendarPage.getTotalDay(this.Year,Number(this.Month)); // 获取当前月份天数
  const l = this.activedDate?this.activedDate.length:-1; // 存在活动的日期集合长度
   /**
    * this.arr[num]的各个属性注释
    *
    * num 周数组下标
    * v 日历日期
    * id 日期控制是否可选，0 可选; 1 不可选
    * cs 控制选中的样式
    * ca 值为控制字体颜色为白色的类名
    * cp 值为控制字体颜色为黑色的类名
    */
   const ty = this.toYear == this.Year &&Number(this.toMonth) > Number(this.Month);
  for (i = 0,f = 1; f <= totalDay; i++) {
    if(this.arr.length<=0) {
      this.arr.push([]);
    }
    if ( i >= f_week) {
      const tm =(this.toYear == this.Year && Number(this.toMonth) === Number(this.Month) && this.today > f);
      // 判断是否过期，将过期时间显示黑色不可选
      if(this.toYear > this.Year || (ty || tm)) {
        this.arr[num].push({'v':f,'id':1,'cs':false,'cp':'passed'});
      } else {
        // 选出当日存在活动的日期显示白色
        if (l > 0){
          let csd = true;
          for (let j = 0; j <l ; j++) {
            if(f === Number(this.activedDate[j])) {
              this.arr[num].push({'v':f,'id':0,'cs':false,'ca':'actived','num':num});
              csd = false;
              break;
            }
          }
          if(csd){
            this.arr[num].push({'v':f,'id':1,'cs':false});
          }
        }else{
          this.arr[num].push({'v':f,'id':1,'cs':false});
        }
      }
      f++; // 日历日期
    }else {
      this.arr[num].push({'v':'', 'id':1,'cs':false});
    }
    if(this.arr[num].length >= 7 && f <=totalDay){
      this.arr.push([]);
      num++;
    }
  }
  if(this.arr[num].length<7){
    const l = 7-this.arr[num].length; // 不要把计算过程放到循环体内，会出现错误
    for (let j=0; j<l; j++){
      this.arr[num].push({'v':'', 'id':1,'cs':false})
    }
  }
  setTimeout(()=>{
    const dateHeight = $('div.date').height();
    const yearHeight = $('div.year').height();
    const weekHeight = $('div.week').height();
    const titHeight = $('div.calTit').height();
    $('div.calendar').css('height',`${dateHeight+yearHeight+weekHeight}px`);// 设置日历高度
    // const calHeight = $('div.calendar').height();
    $('div.rela_con').css('top',`${dateHeight+yearHeight+weekHeight+titHeight}px`);// 设置活动列表区域top值
    // 添加滑动事件绑定
    if(!this.isBind){
      this.bindEvent();
      this.isBind = true;
    }
  });
}
  // 添加活动列表的事件绑定
  bindEvent() {
    const that = this;
    const yH = Number.parseInt($('.year').height());
    const wH = Number.parseInt($('.week').height());
    const dH = Number.parseInt($('.day:first').height());
    const tH = Number.parseInt($('div.calTit').height());
    const total = yH+wH+tH;
    $("#act-drag").on('touchstart',function ($event) {
      that.sY = Number.parseInt($('#rel_con').css('top'));
      that.orgY = $event.changedTouches[0].screenY;
      return false;
    });
    $("#act-drag").on('touchmove',function ($event) {
      const endY = $event.changedTouches[0].screenY;
      const h = that.orgY - endY;
      // if (Math.abs(h) < 2 ){
      //   return;
      // }
      let top = that.sY-h;
      if ( top <= (total + dH) ){
        top = total + dH;
      }
      if(top <=(total + that.num*dH)) {
        $('div.date').css('top',`${top-tH-that.num*dH}px`);
      } else {
        $('div.date').css('top',`${total-tH}px`)
      }
      const calHeight = Number.parseInt($('div.calendar').height())+Number.parseInt($('div.calTit').height());
      if( top >=  calHeight ) {
        top = calHeight;
      }
      $('#rel_con').css('top',`${top}px`);
    })
  }
// 获取当月天数
static getTotalDay(year,month) {
  switch (month) {
    case 1 :
    case 3 :
    case 5 :
    case 7 :
    case 8 :
    case 10 :
    case 12 :
      return 31;
    case 4 :
    case 6 :
    case 9 :
    case 11 :
      return  30;
    case 2 :
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
       return 29;
      } else {
        return 28;
      }
    default:
      break;
  }
}
choose(item) {
  if(!item.id) {
    const l = this.arr.length;
    for(let i=0; i<l; i++) {
      for(let j=0; j<7; j++){
        this.arr[i][j].cs = false;
      }
    }
    item.cs = true;
    this.num = item.num+1;
    const param =this.Year+'-'+this.Month +'-'+item.v;
    this.getActivityList(param);
  }
}
// 改变月份
  add() {
    this.num = 0;
    this.Month = Number(this.Month)+1;
    if(this.Month>12){
      this.Month = 1;
      this.Year ++;
    }
    if(this.Month<10){
      (this.Month as any) = '0'+this.Month;
    }
    const param = this.Year+'-'+this.Month;
    this.getActivedDate(param);
  }
  sub() {
    this.num = 0;
    this.Month = Number(this.Month)-1;
    if(this.Month < 1){
      this.Month = 12;
      this.Year --;
    }
    if(this.Month<10){
      (this.Month as any) = '0'+this.Month;
    }
    const param = this.Year+'-'+this.Month;
    this.getActivedDate(param);
  }
  // 获取当日活动列表
  getActivityList(param) {
    this.actList = null;
    let getPageStr = {
      'type':'4000',
      'filters':{
        'date':param
      }
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr='+ JSON.stringify(getPageStr),
      data => {
        if (data && data.data) {
          this.actList = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  toBack() {
    this.navCtrl.pop();
  }
  // 跳转活动详情
  toActDetail(id){
    this.navCtrl.push(ActDetailPage,{actid:id});
  }
}
