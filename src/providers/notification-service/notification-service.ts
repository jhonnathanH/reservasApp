import { Notification } from './../../models/notification';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the NotificationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationServiceProvider {
  notification: Notification[] = [];
  constructor(public storage: Storage) {
    this.getNotification().then(
      (data: Notification[]) => {

        if (data) {
          this.notification = data;
        } else {
          this.notification = [];
        }
        console.log('notification' + JSON.stringify(data));
      }
    ).catch(
      err => {
        console.log(err);
      });
  }

  save(body: string, id: number, band: boolean) {
    let item: Notification;
    item = {
      body: body,
      idTeam: id,
      created: new Date(),
      bandNot:band
    }

    console.log('item notification ' + JSON.stringify(item));
    this.notification.push(item);
    console.log('this.notification ' + JSON.stringify(this.notification));
    this.storeNotification(this.notification);
  }



  storeNotification(notification: Notification[]) {

    this.storage.set('Notification', notification)
      .then(
        data => { }
      )
      .catch(
        err => {
          console.log(err);
        }
      );
  }


  getNotification() {
    return this.storage.get('Notification')
      .then(
        (notification: Notification[]) => {
          return notification;
        }
      ).catch(
        //toast
        err => console.log(err)
      );
  }

  deleteNotification() {
    this.storage.remove('Notification');
  }

}
