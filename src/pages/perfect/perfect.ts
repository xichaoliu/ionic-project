import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import $ from 'jquery';
import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-perfect',
  templateUrl: 'perfect.html',
})
export class PerfectPage {
  myDate;
  porPath;
  subPath;
  nickname;
  sexName;
  birthday;
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider
  ) {
  }
  ionViewDidLoad() {
    this.getUserList();
    const that = this;
    $(function() {
      $("input[type='radio']").click(function(){
        $("input[type='radio'][name='"+$(this).attr('name')+"']").parent().removeClass("checked");
        $(this).parent().addClass("checked");
      });
    });
  }
  //  获得用户详情
  getUserList() {
    const getStr = {
      'type':  '0006',
      'filters': {
        'id': localStorage.getItem('usid')
      }
    };
    this.httpService.get(appApis.get_app_data + '?getStr=' + JSON.stringify(getStr),
      data => {
        if (data) {
          if (data.data) {
            this.myDate = data.data.birthday;
            this.nickname = data.data.nickname;
            this.sexName = data.data.sex;
            this.porPath = data.data.profile;
            if(this.sexName){
              $('.radio_label').eq(this.sexName-1).addClass('checked');// 添加性别选中点
            }
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  uploadFile($event): void {
    // console.log('event',JSON.stringify($event));
    this.httpService.upload(appApis.upload_app_file,
      $event,
      data => {
        // console.log(JSON.stringify(data.data));
        this.porPath = data.data.path;
        this.subPath = data.data.url;
      },
      error => {
        console.error(error);
      },
      "file")
  }
  /*提交信息*/
  subInfor(){
    // console.log(this.myDate);
    const str = {
      "type":"0003",
      "key":localStorage.getItem("usid"),
      "data":{
        "nickname": this.nickname.trim(),
        "sex":this.sexName,
        "birthday":this.myDate,
        "profile":this.subPath
      },
      "operate":"A"
    };
    // console.log(JSON.stringify(str));
    this.httpService.get(appApis.get_app_data+ '?postStr='+JSON.stringify(str),
      data => {
        if(data.code == 1){
          let alert = this.alertCtrl.create({
            title: '提示信息',
            subTitle: data.msg,
            buttons: ['确定']
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            title: '提示信息',
            subTitle: data.msg,
            buttons: ['确定']
          });
          alert.present();
        }

      },
      error => {
        console.error(error);
      })
  }
  toBack() {
    this.navCtrl.pop();
  }
}
