import { ProfilePage } from './../pages/profile/profile';
import { FieldsPage } from './../pages/fields/fields';
import { TeamsPage } from './../pages/teams/teams';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
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
  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
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
      
      this.platform.registerBackButtonAction(() => {
        // if (this.ifOpenMenu) {
        //   this.menuCtrl.close();
        //   return;
        // }
        if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          this.showAlert();
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
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
