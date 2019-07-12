import { UserServiceProvider } from './../providers/user-service/user-service';
import { OneSignal } from '@ionic-native/onesignal';
import { ProfilePage } from './../pages/profile/profile';
import { FieldsPage } from './../pages/fields/fields';
import { TeamsPage } from './../pages/teams/teams';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, App, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { NotificationServiceProvider } from '../providers/notification-service/notification-service';
import { HistoryMatchsPage } from '../pages/history-matchs/history-matchs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  activePage: any;
  ifOpenMenu: boolean;
  ifCloseMenu: boolean;
  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private oneSignal: OneSignal,
    private userService: UserServiceProvider,
    public app: App,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public notificationsService: NotificationServiceProvider,
    public alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', icon: 'md-home', component: HomePage },
      // { title: 'List', component: ListPage },
      { title: 'Equipos', icon: 'md-list-box', component: TeamsPage },
      { title: 'Canchas', icon: 'football', component: FieldsPage },
      { title: 'Perfil/Usuario', icon: 'person', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#0031ca');
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.handlerNotifications();
      }
      this.getUser();
    });
  }
  private handlerNotifications() {
    this.oneSignal.startInit('30992fe4-bc5a-4666-9a20-bb7f822940d2', '416991332199');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.setSubscription(true);
    this.oneSignal.handleNotificationReceived()
      .subscribe(jsonData => {
        console.log('handleNotificationReceived');

        console.log('body ' + jsonData.payload.body, jsonData.payload);

        console.log('idTeam ' + jsonData.payload.additionalData.idTeam);
        this.notificationsService.save(jsonData.payload.body, jsonData.payload.additionalData.idTeam, jsonData.payload.additionalData.bandNot);
      });
    this.oneSignal.handleNotificationOpened()
      .subscribe(jsonData => {
        let alert = this.alertCtrl.create({
          title: jsonData.notification.payload.title,
          subTitle: jsonData.notification.payload.body,
          buttons:
            [
              {
                text: 'Si, Continuar',
                handler: () => {
                  console.log('OK');
                  if (jsonData.notification.payload.additionalData.bandNot) {
                    this.nav.push(TeamsPage, { idTeam: jsonData.notification.payload.additionalData.idTeam });
                  } else {
                    this.nav.push(HistoryMatchsPage, { teamSearch: jsonData.notification.payload.additionalData.idTeam });
                  }
                }
              },
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel cliecked');
                }
              }
            ]
        });
        alert.present();
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      });
    this.oneSignal.endInit();
  }

  getUser() {
    this.userService.getStoreUser().then(
      (data) => {
        let x = data;
        if (x != null) {
          this.rootPage = HomePage;
        } else {
          console.log('no hay id ');
          this.rootPage = LoginPage;
        }
      }
    );
  }

  openPage(page) {
    if (page.component == HomePage) {
      this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
    }
  }

  menuOpened() {
    this.ifOpenMenu = true;
    this.ifCloseMenu = false;
    console.log(this.ifOpenMenu);
  }
  menuClose() {
    this.ifCloseMenu = true;
    this.ifOpenMenu = false;
    console.log(this.ifCloseMenu + 's');
  }

  public checkActivePage(page): boolean {
    return page === this.activePage;
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Salir de la Aplicación',
      message: 'Desea salir de la app?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert = null;
          }
        },
        {
          text: 'Salir',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

}
