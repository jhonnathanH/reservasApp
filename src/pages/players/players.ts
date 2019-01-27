import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { PlayersServiceProvider } from '../../providers/players-service/players-service';


@Component({
  selector: 'page-players',
  templateUrl: 'players.html',
})
export class PlayersPage {
  teamPlayers: any;
  constructor(public playersService: PlayersServiceProvider,
    public userService: UserServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      console.log("1");
      
    this.teamPlayers = this.userService.listUser;
  }

  ionViewWillEnter() {
  }

  addPlayer(TeamPlayer: User) {

    this.playersService.addPlayerstoTeam(TeamPlayer);
    this.navCtrl.pop();
  }

}
