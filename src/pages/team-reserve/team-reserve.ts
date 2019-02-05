import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Team } from '../../models/team';

/**
 * Generated class for the TeamReservePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-team-reserve',
  templateUrl: 'team-reserve.html',
})
export class TeamReservePage {
  team: Team;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.team = this.navParams.get("team");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamReservePage');
  }

}
