import { DetailTeamPage } from './../detail-team/detail-team';
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { Team } from './../../models/team';
import { AddTeamPage } from './../add-team/add-team';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlayersServiceProvider } from '../../providers/players-service/players-service';

/**
 * Generated class for the TeamsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {

  constructor( public playersService: PlayersServiceProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public teamService: TeamServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamsPage');
  }
  createTeam() {
    this.navCtrl.push(AddTeamPage);
  }

  goToDetail(team: Team) {
    this.playersService.removeAllPlayerstoTeam();
    this.navCtrl.push(DetailTeamPage,{team:team});
  }

}
