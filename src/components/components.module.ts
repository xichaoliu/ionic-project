import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SeeHearComponent } from './see-hear/see-hear';
import { CulActivityComponent } from './cul-activity/cul-activity';
import { AcvOnlineComponent } from './acv-online/acv-online';
import { MapPlaceComponent } from './map-place/map-place';
import { MapActiveComponent } from './map-active/map-active';
import { MapLandscapeComponent } from './map-landscape/map-landscape';
import { LunboTopComponent } from './lunbo-top/lunbo-top';
import { ActNavdelComponent } from './act-navdel/act-navdel';
import { SpaceListComponent } from './space-list/space-list';
import { CollectTranspondComponent } from './collect-transpond/collect-transpond';
import { VenueComponent } from './venue/venue';
import { AppraiseListComponent } from './appraise-list/appraise-list';
import { PopMessComponent } from './pop-mess/pop-mess';
import { MsgTextComponent } from './msg-text/msg-text';
import { MsgPicComponent } from './msg-pic/msg-pic';
import { BombboxComponent } from './bombbox/bombbox';
import { OrderlistComponent } from './orderlist/orderlist';
import { ActivityListComponent } from './activity-list/activity-list';
@NgModule({
	declarations: [
    SeeHearComponent,
    CulActivityComponent,
    MapPlaceComponent,
    MapActiveComponent,
    MapLandscapeComponent,
    AcvOnlineComponent,
    LunboTopComponent,
    ActNavdelComponent,
    SpaceListComponent,
    CollectTranspondComponent,
    VenueComponent,
    CollectTranspondComponent,
    AppraiseListComponent,
    PopMessComponent,
    MsgTextComponent,
    MsgPicComponent,
    BombboxComponent,
    OrderlistComponent,
    ActivityListComponent
  ],
	imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
  ],
	exports: [
    SeeHearComponent,
    CulActivityComponent,
    AcvOnlineComponent,
    MapPlaceComponent,
    MapActiveComponent,
    MapLandscapeComponent,
    LunboTopComponent,
    ActNavdelComponent,
    SpaceListComponent,
    CollectTranspondComponent,
    VenueComponent,
    AppraiseListComponent,
    PopMessComponent,
    MsgTextComponent,
    MsgPicComponent,
    BombboxComponent,
    OrderlistComponent,
    ActivityListComponent,
  ]
})
export class ComponentsModule {}
