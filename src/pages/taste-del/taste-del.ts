import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TasteAppsubPage} from "../taste-appsub/taste-appsub";
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import $ from 'jquery';

@Component({
  selector: 'page-taste-del',
  templateUrl: 'taste-del.html',
})
export class TasteDelPage {
  tastId;
  appraiseNum;
  testDel: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.tastId = navParams.data.tastId;
  }
  ionViewWillEnter(){
    this.getValueList();
  }
  ionViewDidLoad() {
    this.getTastDel();
    this.getValueList();
    //根据设备尺寸固定内容高度
    const div = document.getElementById('tasDelBody');
    const tit = document.getElementsByClassName('tdelTit')[0];
    div.style.height = document.documentElement.clientHeight - tit.clientHeight + 'px';
  }
  /*见闻详情*/
  getTastDel(){
    const getStr = {
      'type': '11001',
      'filters':{
        'id': this.tastId,
        'accid': localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data && data.data){
          // console.log(data.data);
          this.testDel = data.data;
          if(data.data.description){
            this.reRender(data.data.description)
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  reRender(str){
//	var str = "<text>a&插入文本&<br>&发&<br>&<br>&&nbsp;&nbsp;&大&</text><video thum='[1506052140141]'>d{1506052140141}</video><caption>b&插入标题对对对&<br>&&nbsp; 嗯，对的&</caption><picture>c1506052142532</picture><text>a&插入文本&<br>&发&<br>&</text>";
    let patt2 = /(<text>|<caption>|<picture>|<video>|<\/text>|<\/picture>|<\/caption>|<\/video>|<video[^br][\S]*?>)/g;
    let arr = str.replace(patt2,"█").replace(/█{2}/g,"█").slice(1,-1).split("█");
    //var col=[];
//	var arr =  ["a&插入文本&<br>&发&<br>&<br>&&nbsp;&nbsp;&大&", "dhttp://119.60.8.230:10088/EasyTrans/Data/cc153d43-17d5-4de7-8ec3-318ed65724f6/video.m3u8", "b&插入标题对对对&<br>&&nbsp; 嗯，对的&", "cimg/0.jpg", "a&插入文本&<br>&发&<br>&"]
    let l = arr.length;
    for(let i=0; i<l; i++){
      let index = arr[i][0];
      if(index =="a" || index =="b"){
//			var col = arr[i].split("%").slice(1,-1);
        let st = arr[i].substr(2).replace(/[\r\n]/g,"%")
        let col = st.split("%").slice(0,-1)
        if( index == "a" ){
          this.renderTxt(st,col);

        }
        if(index == "b"){
          this.renderPara(st,col);
        }
      }
      if(index == "c" || index == "d"){
        let sr = arr[i].substr(1);
        console.log(sr);

        if(index == "d"){
          //col.push(sr);
          // this.renderVideo(sr);
          // console.log(sr);

        }
        if(index =="c"){
          this.renderImg(sr);
        }
      }
    }
  }
//重绘文本
  renderTxt(str,arr){

    let _con = $("<div></div>").addClass("textarea ct").attr("data",str).appendTo("#content");
    let _div = $("<div></div>").addClass("editor para");
    $(_div).appendTo(_con);
    for(let i=0; i<arr.length; i++){
      let _smallDiv = $("<div>"+arr[i]+"</div>");
      $(_div).append(_smallDiv);
    }
    // $("<span></span>").addClass("cancel").html("X").appendTo(_con);
  }
//重绘段落
  renderPara(str,arr){
    let _con = $("<div></div>").addClass("textarea ct").attr("data",str).appendTo("#content");
    let _div = $("<div></div>").addClass("editor title");
    $(_div).appendTo(_con);
    for(let i=0; i<arr.length; i++){
      let _smallDiv = $("<div>"+arr[i]+"</div>")
      $(_div).append(_smallDiv);

    }

    $("<span></span>").addClass("cancel").html("X").appendTo(_con);
  }
//重绘图片
  renderImg(str){
    let day = new Date
    let num = day.getTime()

    $("<div></div>").addClass("img ct IV Img"+num).attr("Img",str).appendTo("#content");
    // $("<span></span>").addClass("cancel").html("X").appendTo("div.Img"+num);
    $("<img>",{
      src:str
    }).appendTo("#content>div.Img"+num);
  }
  // 获得见闻评论列表
  getValueList() {
    const getPageStr = {
      'type': '0016',
      'filters': {
        'type': '10',
        'bizid': this.tastId,
      },
    };
    this.httpService.get(appApis.get_app_data + '?getPageStr=' + JSON.stringify(getPageStr),
      data => {
        if (data ) {
          this.appraiseNum = data.rows;
        }},
      error => {
        console.error(error);
      });
  }
  /*收藏*/
  reCollect($event){
    this.getTastDel();
  }
  toTastAppSub(tasteID,title){
    this.navCtrl.push(TasteAppsubPage,{tasteID:tasteID, tasteTit:title});
  }
  toBack() {
    this.navCtrl.pop();
  }
}
