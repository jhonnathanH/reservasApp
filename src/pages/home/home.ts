import { PlayersServiceProvider } from './../../providers/players-service/players-service';
import { MatchServiceProvider } from './../../providers/match-service/match-service';
import { PopOverNotificationPage } from './../../popover/popover-notification';
import { HistoryMatchsPage } from './../history-matchs/history-matchs';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';
import { NavController, AlertController, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { ProfilePage } from '../profile/profile';
import { TeamsPage } from '../teams/teams';
import { Match } from '../../models/match';
import { User } from '../../models/user';
import { Team } from '../../models/team';
import { TeamReservePage } from '../team-reserve/team-reserve';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userProfile: any;
  user: User;
  teamSearch: number;
  listaMatch: Match[] = [];
  original: Match[];
  searchTerm: string = '';
  selectSerch = false;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public matchService: MatchServiceProvider,
    public toastCrl: ToastController,
    public loadingCtrl: LoadingController,
    public playersService: PlayersServiceProvider,
    public userService: UserServiceProvider) {
  
  }

  ionViewWillEnter() {

        this.userService.getStoreUser().then(
          (data) => {
            this.userProfile = data;
            this.user = this.userProfile;
            this.getMAtch();
          }
        );
     
  }

  find() {
    if (this.userProfile) {
      this.navCtrl.push(HistoryMatchsPage, { user: this.userProfile });
    } else {
      const alert = this.alertCtrl.create({
        title: 'Debe Logearse',
        subTitle: '¿Esta seguro?',
        message: 'recuerde, logearse para ver sus reservas',
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

  onNotifications(event: MouseEvent) {
    const popover = this.popoverCtrl.create(PopOverNotificationPage);
    popover.present({ ev: event });
    popover.onDidDismiss(
      data => {
        if (data) {
          if (data.notification.bandNot) {
            this.navCtrl.push(TeamsPage, { idTeam: data.notification.idTeam });
          } else {
            this.navCtrl.push(HistoryMatchsPage, { teamSearch: data.notification.idTeam });
          }

        }
      });
  }

  getMAtch() {
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
      this.toastSuccess('Reservaciones Cargadadas');
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
