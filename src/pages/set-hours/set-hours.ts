import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SetHoursPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-set-hours',
  templateUrl: 'set-hours.html',
})
export class SetHoursPage {
  hoursTotal: {
    valid: boolean,
    time: string
  }[] = [];
  valueMaxDivHour = 16;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController,
    public navParams: NavParams) {
    for (let i = 0; i < this.valueMaxDivHour; i++) {
      let a: {
        valid: boolean,
        time: string
      };
      let numHourMin = 7 + i;
      let numHourMax = 8 + i;
      a = {
        valid: true,
        time: numHourMin + ':00 - ' + numHourMax + ':00'
      };
      console.log('hours a)' + JSON.stringify(a));
      this.hoursTotal.push(a);
    }
    console.log('hours hours' + JSON.stringify(this.hoursTotal));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetHoursPage');
  }

  setFalse(a: any, i: number) {
    this.hoursTotal[i].valid = !this.hoursTotal[i].valid;
  }

  onConfirm() {
    let hours: string[] = [];

    for (let i = 0; i < this.hoursTotal.length; i++) {
      if (this.hoursTotal[i].valid) {
        hours.push(this.hoursTotal[i].time);
      }
    }

    this.viewCtrl.dismiss({ hours: hours });
  }

  onAbort() {
    this.viewCtrl.dismiss();
  }

}
