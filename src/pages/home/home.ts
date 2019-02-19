import { PopOverNotificationPage } from './../../popover/popover-notification';
import { HistoryMatchsPage } from './../history-matchs/history-matchs';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';
import { NavController, AlertController, PopoverController } from 'ionic-angular';
import firebase from 'firebase';
import { ProfilePage } from '../profile/profile';
import { TeamsPage } from '../teams/teams';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userProfile: any;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public userService: UserServiceProvider) {

  }

  ionViewWillEnter() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userService.getStoreUser().then(
          (data) => {
            this.userProfile = data;
          }
        );
      } else {
        // this.userProfile = null;
      }
    });
  }

  find() {
    if (this.userProfile) {
      this.navCtrl.push(HistoryMatchsPage, { user: this.userProfile });
    } else {
      const alert = this.alertCtrl.create({
        title: 'Debe Logearse',
        subTitle: '¿Esta seguro?',
        message: 'recuerde, logearse para ver sus reservas',
        buttons:
          [
            {
              text: 'Si, Continuar',
              handler: () => {
                console.log('OK');
                this.navCtrl.push(ProfilePage);

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
    }
  }

  onNotifications(event: MouseEvent) {
    const popover = this.popoverCtrl.create(PopOverNotificationPage);
    popover.present({ ev: event });
    popover.onDidDismiss(
      data => {
        if (data) {
          if(data.notification.bandNot){
            this.navCtrl.push(TeamsPage, { idTeam: data.notification.idTeam });
          }else {
            this.navCtrl.push(HistoryMatchsPage, { teamSearch: data.notification.idTeam });
          }
         
        }
      });
  }
}
