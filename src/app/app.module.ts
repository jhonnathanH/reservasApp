import { PopOverNotificationPage } from './../popover/popover-notification';
import { AgmCoreModule } from '@agm/core';

import { HistoryMatchsPage } from './../pages/history-matchs/history-matchs';
import { GooglePlus } from '@ionic-native/google-plus';
import { CalendarMatchPage } from './../pages/calendar-match/calendar-match';
import { ProfilePage } from './../pages/profile/profile';
import { FieldsPage } from './../pages/fields/fields';
import { TeamsPage } from './../pages/teams/teams';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpModule  } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AddTeamPage } from '../pages/add-team/add-team';
import { TeamServiceProvider } from '../providers/team-service/team-service';
import { DetailTeamPage } from '../pages/detail-team/detail-team';
import { PlayersPage } from '../pages/players/players';
import { PlayersServiceProvider } from '../providers/players-service/players-service';
import { SelectTeamPage } from '../pages/select-team/select-team';
import { MatchServiceProvider } from '../providers/match-service/match-service';
import { OneSignal } from '@ionic-native/onesignal';
import { TeamReservePage } from '../pages/team-reserve/team-reserve';
import { PopOverMapsPage } from '../popover/popover-maps-options';
import { AddFieldPage } from '../pages/add-field/add-field';
import { FieldServiceProvider } from '../providers/field-service/field-service';
import { DetailFieldPage } from '../pages/detail-field/detail-field';
import { SetLocationPage } from '../pages/set-location/set-location';
import { SetHoursPage } from '../pages/set-hours/set-hours';
import { FirebaseImageServiceProvider } from '../providers/firebase-image-service/firebase-image-service';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { NotificationServiceProvider } from '../providers/notification-service/notification-service';
import { NotificationON } from '../component/notificationOn';
//config firebase 
export const firebaseConfig = {
  apiKey: "AIzaSyBQkYH5YbaqfcM3SO-N-CH6SXKNaTTrf1Y",
  authDomain: "playsport2019-7be22.firebaseapp.com",
  databaseURL: "https://playsport2019-7be22.firebaseio.com",
  projectId: "playsport2019-7be22",
  storageBucket: "playsport2019-7be22.appspot.com",
  messagingSenderId: "416991332199"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TeamsPage,
    FieldsPage,
    ProfilePage,
    AddTeamPage,
    CalendarMatchPage,
    DetailTeamPage,
    PlayersPage,
    SelectTeamPage,
    HistoryMatchsPage,
    TeamReservePage,
    PopOverMapsPage,
    PopOverNotificationPage,
    AddFieldPage,
    DetailFieldPage,
    SetLocationPage,
    SetHoursPage,
    NotificationON
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpModule,
    IonicImageViewerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDqBHmO5xJupFv2qdjXS1AudrQlaFPOxrE'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TeamsPage,
    FieldsPage,
    ProfilePage,
    AddTeamPage,
    CalendarMatchPage,
    DetailTeamPage,
    PlayersPage,
    SelectTeamPage,
    HistoryMatchsPage,
    TeamReservePage,
    PopOverMapsPage,
    PopOverNotificationPage,
    AddFieldPage,
    DetailFieldPage,
    SetLocationPage,
    SetHoursPage,
    NotificationON
    ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    AuthServiceProvider,
    TeamServiceProvider,
    GooglePlus,
    PlayersServiceProvider,
    MatchServiceProvider,
    OneSignal,
    FieldServiceProvider,
    ImagePicker,
    FirebaseImageServiceProvider,
    NotificationServiceProvider
    
  ]
})
export class AppModule {}
