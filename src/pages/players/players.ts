import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { PlayersServiceProvider } from '../../providers/players-service/players-service';


@Component({
  selector: 'page-players',
  templateUrl: 'players.html',
})
export class PlayersPage {
  teamPlayers: any;
  listaUser: User[] = [];
  original: User[];
  searchTerm: string = '';
  selectSerch = false;
  players: User[];
  constructor(public playersService: PlayersServiceProvider,
    public userService: UserServiceProvider,
    public toastCrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.players = this.navParams.get("players");

    if (this.userService.getStoreUser()) {
      let x = this.userService.getUserStore();
      this.listaUser = x;
      for (let i = 0; i < this.players.length; i++) {

        console.log(this.players[i].name);
        this.removePlayersfromTeam(this.players[i]);
      }
      this.original = this.listaUser;
      console.log('carga User-store');
      this.toastSuccess('Jugadores Cargados');
    }
    this.userService.getUsers().subscribe(res => {
      // ordernar sort string
      // var stringArray: string[] = ['AB', 'Z', 'A', 'AC'];
      // var sortedArray: string[] = stringArray.sort((n1, n2) => {
      //   if (n1 > n2) {
      //     return 1;
      //   }
      //   if (n1 < n2) {
      //     return -1;
      //   }
      //   return 0;
      // });
      let xString = res;
      let x: User[] = xString.sort((n1, n2) => {
        if (n1.name > n2.name) {
          return 1;
        }
        if (n1.name < n2.name) {
          return -1;
        }
        return 0;
      });

      this.userService.addUserStore(x);
      this.listaUser = x;
      this.original = x;
      for (let i = 0; i < this.players.length; i++) {

        console.log(this.players[i].name);
        this.removePlayersfromTeam(this.players[i]);
      }
      this.original = this.listaUser;
    });
  }

  removePlayersfromTeam(player: User) {

    const position = this.listaUser.findIndex((user: User) => {
      return user.uid == player.uid;
    });
    this.listaUser.splice(position, 1);
  }

  ionViewWillEnter() {
  }


  addPlayer(TeamPlayer: User) {
    TeamPlayer.state = 1;
    this.playersService.addPlayerstoTeam(TeamPlayer);
    this.navCtrl.pop();
  }

  searchPlayers() {
    // Reset customers array back to all of the items

    this.listaUser = this.original;

    // if the search term is an empty string return all items
    if (!this.searchTerm) {
      return this.listaUser;
    }

    // Filter recipes
    this.listaUser = this.listaUser.filter((item) => {
      return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
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

  private toastSuccess(valor: string) {
    const toast = this.toastCrl.create({
      message: valor,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}
