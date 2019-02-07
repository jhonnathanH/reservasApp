import { OneSignal } from '@ionic-native/onesignal';
import { ProfilePage } from './../pages/profile/profile';
import { FieldsPage } from './../pages/fields/fields';
import { TeamsPage } from './../pages/teams/teams';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ViewController, App, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  activePage: any;
  ifOpenMenu: boolean;
  ifCloseMenu: boolean;
  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private oneSignal: OneSignal,
    public app: App,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
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
      // this.platform.registerBackButtonAction(() => {
      // if (this.ifOpenMenu) {
      //   this.menuCtrl.close();
      //   return;
      // }
      //   if (this.nav.canGoBack()) {
      //   this.nav.pop();
      //  } else {
      //   this.showAlert();
      //  }
      // });
      var lastTimeBackPress = 0;
      var timePeriodToExit = 2000;
      // this.platform.registerBackButtonAction(() => {
      //   if (this.ifOpenMenu) {
      //     this.menuCtrl.close();
      //     return;
      //   }
      //   let view = this.nav.getActive();
      //   if (view.component.name == "HomePage") {
      //     //Double check to exit app                  
      //     if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
      //       this.platform.exitApp(); //Exit from app
      //     } else {
      //       let toast = this.toastCtrl.create({
      //         message: 'Press back again to exit App',
      //         duration: 3000,
      //         position: 'bottom'
      //       });
      //       toast.present();
      //       lastTimeBackPress = new Date().getTime();
      //     }
      //   } else if (view.component.name == "ProfilePage") {
      //     // go to previous page
      //     this.nav.pop();
      //   }
      //   else {
      //     this.nav.pop({});
      //   }
      // });
    });
  }
  private handlerNotifications() {
    this.oneSignal.startInit('30992fe4-bc5a-4666-9a20-bb7f822940d2', '416991332199');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.setSubscription(true);
    this.oneSignal.handleNotificationOpened()
      .subscribe(jsonData => {
        let alert = this.alertCtrl.create({
          title: jsonData.notification.payload.title,
          subTitle: jsonData.notification.payload.body,
          buttons: ['OK']
        });
        alert.present();
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      });
    this.oneSignal.endInit();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
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
