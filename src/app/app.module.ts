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
    PlayersPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpModule,
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
    PlayersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    AuthServiceProvider,
    TeamServiceProvider,
    GooglePlus,
    PlayersServiceProvider
  ]
})
export class AppModule {}
