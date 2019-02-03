import { ProfilePage } from './../profile/profile';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { DetailTeamPage } from './../detail-team/detail-team';
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { Team } from './../../models/team';
import { AddTeamPage } from './../add-team/add-team';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { PlayersServiceProvider } from '../../providers/players-service/players-service';
import firebase from 'firebase';

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {
  searchTerm: string = '';
  selectSerch = false;
  userProfile: any;
  listaTeam: Team[] = [];
  original: Team[];
  constructor(public playersService: PlayersServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCrl: ToastController,
    public userService: UserServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public teamService: TeamServiceProvider) {


    this.teamService.getTeams().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.teamService.addTeamsStore(x);
      this.listaTeam = x;
      this.original = x;
      //save Team
      loadingIni.dismiss();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.teamService.getTeamsStore()) {
      console.log('sssACA');
      let x = this.teamService.getTeamsStore();
      this.listaTeam = x;
      this.original = x;
      this.toastSuccess('Equipos Cargados');
    }
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
    //this.navCtrl.push(DetailTeamPage, { team: team });
    const modal = this.modalCtrl.create(DetailTeamPage, { team: team });
    modal.present();
  }

  searchTeams() {
    // Reset customers array back to all of the items

    this.listaTeam = this.original;

    // if the search term is an empty string return all items
    if (!this.searchTerm) {
      return this.listaTeam;
    }

    // Filter recipes
    this.listaTeam = this.listaTeam.filter((item) => {
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

  available(teamToReserve: Team) {
    let assisTeam = [];
    for (let i = 0; i < teamToReserve.players.length; i++) {
      if (teamToReserve.players[i].state == 1) {
        assisTeam.push(teamToReserve.players[i]);
      }
    }
    return assisTeam.length
  }

  private toastSuccess(valor: string) {
    const toast = this.toastCrl.create({
      message: valor,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  private loading(textLoading: string) {
    let loading = this.loadingCtrl.create({
      content: textLoading
    });
    loading.present();
    return loading;
  }

}
