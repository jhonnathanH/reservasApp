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
  listaMatch: Match[] = [];
  original: Match[];
  searchTerm: string = '';
  selectSerch = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCrl: ToastController,
    public loadingCtrl: LoadingController,
    public matchService: MatchServiceProvider) {
    this.user = this.navParams.get("user");


    this.matchService.getMatchs().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.matchService.addMatchStore(x);
      x = this.getMatchByID(this.user, x);
      this.listaMatch = x;
      this.original = x;
      //save Team
      loadingIni.dismiss();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.matchService.getMatchsStore()) {
      console.log('sssACA');
      let x = this.matchService.getMatchsStore();
      x = this.getMatchByID(this.user, x);
      this.listaMatch = x;
      this.original = x;
      this.toastSuccess('Equipos Cargados');
    }
  }

  getMatchByID(user: User, xList: Match[]) {
    let newX: Match[] = [];
    for (let i = 0; i < xList.length; i++) {
      console.log('useruid' + user.uid);
      console.log('xList[i].leadUser.uid' + xList[i]);
      if (user.uid == xList[i].team.leadUser.uid) {
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

  cancelMatch(macth: Match) {
    macth.assis = false;
    this.matchService.updateMatch(macth.id, macth);
  }

  seeTeam(team: Team) {
    this.navCtrl.push(TeamReservePage, { team: team });
  }

}
