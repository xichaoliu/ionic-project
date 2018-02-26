import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Camera} from "@ionic-native/camera";
import {QQSDK} from "@ionic-native/qqsdk";
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {StoreModule} from '@ngrx/store';
import {QRCodeModule} from 'angular2-qrcode';
import {NavPage} from "../pages/nav/nav";
import {CulturePage} from "../pages/culture/culture";
import {ActivityPage} from "../pages/activity/activity";
import {MapPage} from "../pages/map/map";
import {TastePage} from "../pages/taste/taste";
import {MePage} from "../pages/me/me";
import {CalendarPage} from "../pages/calendar/calendar";
import {SwitchCityPage} from "../pages/switch-city/switch-city";
import {ActOnlinePage} from "../pages/act-online/act-online";
import {MapSearchPage} from "../pages/map-search/map-search";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpServiceProvider} from '../providers/http-service/http-service';
import {AuthInterceptor} from "../providers/auto-intercepter";
import {mapNavReducer, regionReducer} from "../stateStore/logReducer";

import {ComponentsModule} from "../components/components.module";
import {PlaceDelPage} from "../pages/place-del/place-del";
import {ActDetailPage} from "../pages/act-detail/act-detail";
import {LoginPage} from '../pages/login/login';
import {RegistPage} from '../pages/regist/regist';
import {ReversePage} from "../pages/reverse/reverse";

import {Geolocation} from "@ionic-native/geolocation"
import {ReverseDelPage} from "../pages/reverse-del/reverse-del";
import {ForgetPage} from '../pages/forget/forget';
import {AppraisePage} from "../pages/appraise/appraise";
import {SearchPage} from '../pages/search/search';
import {AppraiseSubmitPage} from "../pages/appraise-submit/appraise-submit";
import {SpaceDelPage} from "../pages/space-del/space-del";
import {VideoPage} from "../pages/video/video";
import {MsgCenterPage} from "../pages/msg-center/msg-center"
import {MsgDelPage} from '../pages/msg-del/msg-del';
import {SettingPage} from '../pages/setting/setting';
import {PerfectPage} from '../pages/perfect/perfect';
import {GuanzhuPage} from '../pages/guanzhu/guanzhu';
import {ShoucangjiaPage} from '../pages/shoucangjia/shoucangjia';
import {OrderPage} from '../pages/order/order';
import {TasteDelPage} from "../pages/taste-del/taste-del";
import {TasteAppsubPage} from "../pages/taste-appsub/taste-appsub";
import {YijianPage} from '../pages/yijian/yijian';
import {AboutusPage} from '../pages/aboutus/aboutus';
import {ScenDelPage} from "../pages/scen-del/scen-del";
import {CDVPhotoLibraryPipe} from '../cdvphotolibrary.pipe';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {AppUpdate} from "@ionic-native/app-update";
import {AppVersion} from "@ionic-native/app-version";
import {FileOpener} from "@ionic-native/file-opener";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from '@ionic-native/file';
@NgModule({
  declarations: [
    MyApp,
    NavPage,
    CulturePage,
    ActivityPage,
    MapPage,
    TastePage,
    MePage,
    CalendarPage,
    SwitchCityPage,
    ActOnlinePage,
    PlaceDelPage,
    ActDetailPage,
    ReversePage,
    MapSearchPage,
    ReverseDelPage,
    LoginPage,
    RegistPage,
    ForgetPage,
    SearchPage,
    AppraisePage,
    AppraiseSubmitPage,
    SpaceDelPage,
    VideoPage,
    MsgCenterPage,
    MsgDelPage,
    SettingPage,
    PerfectPage,
    GuanzhuPage,
    ShoucangjiaPage,
    OrderPage,
    TasteDelPage,
    TasteAppsubPage,
    YijianPage,
    AboutusPage,
    CDVPhotoLibraryPipe,
    ScenDelPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    QRCodeModule,
    IonicModule.forRoot(MyApp),
    StoreModule.forRoot({
      'region': regionReducer,
      'cdt':mapNavReducer
    } )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NavPage,
    CulturePage,
    ActivityPage,
    MapPage,
    TastePage,
    MePage,
    CalendarPage,
    SwitchCityPage,
    ActOnlinePage,
    PlaceDelPage,
    ActDetailPage,
    MapSearchPage,
    LoginPage,
    RegistPage,
    ReversePage,
    ReverseDelPage,
    ForgetPage,
    SearchPage,
    AppraisePage,
    AppraiseSubmitPage,
    SpaceDelPage,
    VideoPage,
    MsgCenterPage,
    MsgDelPage,
    SettingPage,
    PerfectPage,
    GuanzhuPage,
    ShoucangjiaPage,
    OrderPage,
    TasteDelPage,
    TasteAppsubPage,
    YijianPage,
    AboutusPage,
    ScenDelPage
  ],
  providers: [
    StatusBar,
    Camera,
    AppVersion,
    FileOpener,
    FileTransferObject,
    FileTransfer,
    File,
    AppUpdate,
    QQSDK,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    HttpServiceProvider,
    Geolocation
  ]
})
export class AppModule {}
