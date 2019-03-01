import { PopoverController, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { PopOverNotificationPage } from '../popover/popover-notification';
import { TeamsPage } from '../pages/teams/teams';
import { HistoryMatchsPage } from '../pages/history-matchs/history-matchs';


@Component({
  selector: 'page-notificationOn',
  templateUrl: 'notificationOn.html',
})
export class NotificationON {

constructor(public popoverCtrl: PopoverController,
    public navCtrl: NavController){
    
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
