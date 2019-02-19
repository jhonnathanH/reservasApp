import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NotificationServiceProvider } from '../providers/notification-service/notification-service';
import { Notification } from '../models/notification';

@Component({
  selector: 'page-popover-maps-option',
  template: `
                 <ion-item *ngFor="let notification of notifications; let i=index">
                      <div (click)="goToDetail(notification)">
                        <ion-note>
                        <textarea rows="3" cols="30" disabled>{{notification.body}} </textarea>
                        <h5>Fecha {{notification.created | date:'short'}}</h5>
                        </ion-note>
                      </div>
                  
                 </ion-item>
              `,
  styles: [
    `
    textarea {
      border: none;
      color: #8187ff !important;
      background-color: white !important;
      overflow: auto;
      outline: none;
      font-size: 12px;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      disea
      resize: none; /*remove the resize handle on the bottom right*/
                }
      h5 {
        font-size: 11px;
      }
                `
  ],
})

export class PopOverNotificationPage {
  notifications: Notification[] = [];
  constructor(private viewCtrl: ViewController, public notificaService: NotificationServiceProvider) {

    this.notificaService.getNotification()
      .then(
        (data: Notification[]) => {
          this.notifications = data;
          // ordernar sort
          this.notifications.sort((a1, b1) => b1.created.getTime() - a1.created.getTime());
        }
      ).catch(
        err => {
          console.log(err);
        });
  }

  goToDetail(notification: Notification) {
    this.viewCtrl.dismiss({ notification: notification });
  }
}