import { FirebaseImageServiceProvider } from './../../providers/firebase-image-service/firebase-image-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Field } from '../../models/field';
import { CalendarMatchPage } from '../calendar-match/calendar-match';

/**
 * Generated class for the DetailFieldPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-field',
  templateUrl: 'detail-field.html',
})
export class DetailFieldPage {
  field: Field;
  bandSee: boolean;
  bandField: boolean;
  images = [];
  constructor(public navCtrl: NavController,
    public firebaseImage: FirebaseImageServiceProvider,
    public navParams: NavParams) {

    this.field = this.navParams.get("field");
    if (this.field.location != null) {
      this.bandField = true;
    }
  }

  ionViewDidLoad() {
    this.images = this.firebaseImage.downLoadImage(this.field.id, this.field.countImages);
    console.log('this.image' + JSON.stringify(this.images));
  }


  goToCalendar(nomCancha: string) {
    console.log('nomCancha' + this.field.fieldName);
    this.navCtrl.push(CalendarMatchPage, { field: this.field });
  }

  seeMap() {
    if (this.bandField) {
      this.bandSee = !this.bandSee;
    }
  }

}
