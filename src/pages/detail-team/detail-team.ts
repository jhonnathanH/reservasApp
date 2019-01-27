import { TeamsPage } from './../teams/teams';
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { PlayersPage } from './../players/players';
import { PlayersServiceProvider } from './../../providers/players-service/players-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Team } from '../../models/team';

/**
 * Generated class for the DetailTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-team',
  templateUrl: 'detail-team.html',
})
export class DetailTeamPage {
  team: Team;
  constructor(public teamService: TeamServiceProvider,
    public playersService: PlayersServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.team = this.navParams.get("team");
    if (this.team != null) {
      for (let i = 0; i < this.team.players.length; i++) {
        this.playersService.addPlayerstoTeam(this.team.players[i]);
      }
    }
  }

  ionViewWillEnter() {
    this.team.players = this.playersService.getPlayers();
  }

  ionViewWillLeave() {
    // this.playersService.removeAllPlayerstoTeam();
  }
  addPlayer() {

    //  console.log('sss ggggg' + player.name);
    //  this.playersService.addPlayerstoTeam(player);
    //  this.navCtrl.pop();

    this.navCtrl.push(PlayersPage);
  }

  update() {
    this.playersService.removeAllPlayerstoTeam();
    this.teamService.updateTeam(this.team.id,
      {
        id: this.team.id,
        name: this.team.name,
        leadUser: this.team.leadUser,
        sizeTeam: this.team.sizeTeam,
        players: this.team.players
      });
    this.navCtrl.push(TeamsPage);
  }
}
