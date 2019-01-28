import { ProfilePage } from './../profile/profile';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { DetailTeamPage } from './../detail-team/detail-team';
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { Team } from './../../models/team';
import { AddTeamPage } from './../add-team/add-team';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PlayersServiceProvider } from '../../providers/players-service/players-service';
import firebase from 'firebase';
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
  searchTerm: string = '';
  selectSerch = false;
  userProfile: any;
  constructor(public playersService: PlayersServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userService: UserServiceProvider,
    public teamService: TeamServiceProvider) {
  }

  ionViewWillEnter() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userService.getStoreUser().then(
          (data) => {
            this.userProfile = data;
          }
        );
      } else {
        // this.userProfile = null;
      }
    });
  }
  createTeam() {
    if (this.userProfile) {
      this.navCtrl.push(AddTeamPage);
    } else {
      const alert = this.alertCtrl.create({
        title: 'Debe Logearse',
        subTitle: '¿Esta seguro?',
        message: 'recuerde, logearse para ver los equipos y jugadores',
        buttons:
          [
            {
              text: 'Si, Continuar',
              handler: () => {
                console.log('OK');
                this.navCtrl.push(ProfilePage);

              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Cancel cliecked');
              }
            }
          ]
      });
      alert.present();
    }
  }

  goToDetail(team: Team) {
    this.playersService.removeAllPlayerstoTeam();
    this.navCtrl.push(DetailTeamPage, { team: team });
  }

  searchProducts() {
    // Reset customers array back to all of the items
    // this.prodlistTeamsucts = this.teamService.listTeams;
    // // if the search term is an empty string return all items
    // if (!this.searchTerm) {
    //   return this.products;
    // }

    // Filter recipes
    //this.products = this.products.filter((item) => {
    //  return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    //});
  }

  ifSelect() {
    return this.selectSerch;
  }
  onSearch() {
    this.selectSerch = true;
  }
  onCancel(event) {
    console.log(event);
    this.selectSerch = false;
  }

}
