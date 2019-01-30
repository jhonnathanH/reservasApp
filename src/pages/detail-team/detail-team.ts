
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { PlayersPage } from './../players/players';
import { PlayersServiceProvider } from './../../providers/players-service/players-service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  bandLength: boolean;
  constructor(public teamService: TeamServiceProvider,
    public playersService: PlayersServiceProvider,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
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
    console.log(this.team.sizeTeam + 'teamSizexx');
    console.log(this.team.players.length + 'lengthxxx');
    if (this.team.sizeTeam == this.team.players.length) {
      this.bandLength = true;
    }
  }

  ionViewWillLeave() {
    // this.playersService.removeAllPlayerstoTeam();
  }
  removePlayer(index: number) {
    console.log(index + 'index');
    if (index == 0) {
      const alert = this.alertCtrl.create({
        title: 'Accion no permitida',
        message: 'No Puede eliminar al Lider del equipo',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.playersService.removePlayerstoTeam(index);
      this.team.players = this.playersService.getPlayers();
      this.bandLength = false;
    }
  }


  addPlayer() {
    console.log(this.team.sizeTeam + 'teamSize');
    console.log(this.team.players.length + 'length');

    if (this.team.sizeTeam > this.team.players.length) {
      this.navCtrl.push(PlayersPage, { players: this.team.players });
    }
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
    this.navCtrl.pop();
  }
}
