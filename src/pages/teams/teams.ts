import { Match } from './../../models/match';
import { MatchServiceProvider } from './../../providers/match-service/match-service';
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
import { HistoryMatchsPage } from '../history-matchs/history-matchs';

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
  listaMatch: Match[] = [];
  originalM: Match[];
  teamName: string;
  constructor(public playersService: PlayersServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCrl: ToastController,
    public userService: UserServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public matchService: MatchServiceProvider,
    public teamService: TeamServiceProvider) {


    this.teamService.getTeams().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.teamService.addTeamsStore(x);
      this.listaTeam = x;
      //toddoooooo metodo para ver las reservasssssss
      this.original = x;
      //save Team
      loadingIni.dismiss();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.teamService.getTeamsStore()) {
      console.log('sssACA');
      let x = this.teamService.getTeamsStore();
      this.listaTeam = x;
      //toddoooooo metodo para ver las reservasssssss
      this.original = x;
      this.toastSuccess('Equipos Cargados');
    }

    this.matchService.getMatchs().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.matchService.addMatchStore(x);
      this.listaMatch = x;
      this.originalM = x;
      for (let i = 0; i < this.listaTeam.length; i++) {
        this.listaTeam[i].nextMatch = this.getMatchByID(this.listaTeam[i], this.listaMatch);

      }
      loadingIni.dismiss();
      //console.log('matchhh' + JSON.stringify(this.listaMatch) + 'ss');
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.matchService.getMatchsStore()) {
      console.log('sssACA');
      let x = this.matchService.getMatchsStore();
      this.listaMatch = x;
      this.originalM = x;
      for (let i = 0; i < this.listaTeam.length; i++) {
        this.listaTeam[i].nextMatch = this.getMatchByID(this.listaTeam[i], this.listaMatch);

      };
      //console.log('matchs' + JSON.stringify(this.listaMatch) + 'ss');
    }
    this.teamName = this.navParams.get("teamName");
    if (this.teamName != null) {
      this.searchTerm = this.teamName;
      this.searchTeams();
    }

  }

  getMatchByID(teamSearch: Team, xList: Match[]) {
    let day = new Date();
    console.log('//////' + teamSearch.name);

    console.log(xList.length);
    let newX: Match[] = [];
    for (let i = 0; i < xList.length; i++) {

      if (teamSearch != null) {
        let bandDate;
        let dayMatch = new Date(xList[i].month + '/' + xList[i].day + '/' + xList[i].year);

        console.log('dayMatch' + dayMatch);

        // console.log(day <= dayMatch);
        if (day <= dayMatch) {
          bandDate = true;
        }
        console.log(bandDate + 'syyy' + (day <= dayMatch));
        console.log(teamSearch.name + '---' + xList[i].team.name);
        if (teamSearch.name == xList[i].team.name && bandDate) {
          console.log('paso' + xList[i].id);
          newX.push(xList[i])
        }
      }
    }
    newX.sort((a1, b1) => new Date(a1.month + '/' + a1.day + '/' + a1.year).getTime() - new Date(b1.month + '/' + b1.day + '/' + b1.year).getTime());

    return newX;
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
  seeDay(match: Match[]) {
    if (match != null) {
      let a1 = match[0];
      let day = new Date(a1.month + '/' + a1.day + '/' + a1.year)
      return day.toLocaleDateString();
    }
  }
  sizeMatch(match: Match[]) {

    if (match != null) {
      if (match.length > 0) {
        return true;
      }
    } else {
      return false;
    }
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
    if (this.userProfile) {
      this.navCtrl.push(DetailTeamPage, { team: team, user: this.userProfile });
      //  modal.present();

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

  seeMatchs(match: Match[], index: number) {
    console.log('xxxxxxs' + match[0].team.name);
    console.log('matchs' + JSON.stringify(match[0].team) + 'ss');
    this.navCtrl.push(HistoryMatchsPage, { teamSearch: match[0].team });
  }

}
