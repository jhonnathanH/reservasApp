import { PlayersServiceProvider } from './../../providers/players-service/players-service';
import { MatchServiceProvider } from './../../providers/match-service/match-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { User } from '../../models/user';
import { Match } from '../../models/match';
import { Team } from '../../models/team';
import { TeamReservePage } from '../team-reserve/team-reserve';

/**
 * Generated class for the HistoryMatchsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-history-matchs',
  templateUrl: 'history-matchs.html',
})
export class HistoryMatchsPage {
  user: User;
  teamSearch: number;
  listaMatch: Match[] = [];
  original: Match[];
  searchTerm: string = '';
  selectSerch = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCrl: ToastController,
    public loadingCtrl: LoadingController,
    public playersService: PlayersServiceProvider,
    public matchService: MatchServiceProvider) {
    this.user = this.navParams.get("user");
    this.teamSearch = this.navParams.get("teamSearch");

    this.matchService.getMatchs().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n2.id - n1.id);
      this.matchService.addMatchStore(x);
      if (this.user != null) {
        x = this.getMatchByID(this.user, x);
      }
      if (this.teamSearch != null) {
        x = this.getMatchByTeamID(this.teamSearch, x);
      }
      this.listaMatch = x;
      this.original = x;
      //save Team
      loadingIni.dismiss();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.matchService.getMatchsStore()) {

      let x = this.matchService.getMatchsStore();
      if (this.user != null) {
        x = this.getMatchByID(this.user, x);
      }
      if (this.teamSearch != null) {
        x = this.getMatchByTeamID(this.teamSearch, x);
      }
      this.listaMatch = x;
      this.original = x;
      this.toastSuccess('Equipos Cargados');
    }
  }

  getMatchByID(user: User, xList: Match[]) {
    let newX: Match[] = [];
    for (let i = 0; i < xList.length; i++) {
      if (user.uid == xList[i].team.leadUser.uid) {
        newX.push(xList[i])
      }
    }
    return newX;
  }

  getMatchByTeamID(teamID: number, xList: Match[]) {
    //console.log('team aca ' + team.name);
    let newX: Match[] = [];
    for (let i = 0; i < xList.length; i++) {
    //  console.log('team acaFOr ' + xList[i].team.name);
      if (teamID== xList[i].team.id) {
        newX.push(xList[i])
      }
    }
    return newX;
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

  cancelMatch(match: Match) {
    this.playersService.removeAllPlayerstoTeam();
    match.assis = false;
    this.matchService.updateMatch(match.id, match);
  }

  seeTeam(match: Match) {
    this.playersService.removeAllPlayerstoTeam();
    this.navCtrl.push(TeamReservePage, { team: match.team, match: match });
  }

}
