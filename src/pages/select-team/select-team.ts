import { MatchServiceProvider } from './../../providers/match-service/match-service';
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Match } from './../../models/match';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, App, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { Team } from '../../models/team';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-select-team',
  templateUrl: 'select-team.html',
})
export class SelectTeamPage {
  matchReserve: Match;
  user: User;
  listaTeam: Team[] = [];
  original: Team[];
  searchTerm: string = '';
  selectSerch = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public teamService: TeamServiceProvider,
    public loadingCtrl: LoadingController,
    public toastCrl: ToastController,
    public matchService: MatchServiceProvider,
    public appCtrl: App,
    public alertCtrl: AlertController) {

    this.matchReserve = this.navParams.get("matchReserve");
    this.user = this.navParams.get("user");
    if (this.matchReserve != null) {
      console.log('this.user' + this.user);
    }

    this.teamService.getTeams().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.teamService.addTeamsStore(x);
      x = this.getTeamByID(this.user, x);
      this.listaTeam = x;
      this.original = x;
      //save Team
      loadingIni.dismiss();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.teamService.getTeamsStore()) {
      console.log('sssACA');
      let x = this.teamService.getTeamsStore();
      x = this.getTeamByID(this.user, x);
      this.listaTeam = x;
      this.original = x;
      this.toastSuccess('Equipos Cargados');
    }
  }

  getTeamByID(user: User, xList: Team[]) {
    let newX: Team[] = [];
    for (let i = 0; i < xList.length; i++) {
      console.log('useruid' + user.uid);
      console.log('xList[i].leadUser.uid' + xList[i].leadUser.uid);
      if (user.uid == xList[i].leadUser.uid) {
        newX.push(xList[i])
      }
    }
    return newX;
  }

  goToReserve(teamToReserve: Team) {
    let loading = this.loading('Reservando Partido');
    this.matchReserve.team = teamToReserve;
    this.matchReserve.assis = true;
    this.matchReserve.id = this.matchService.lengthListMatchs + 1;
    console.log('reservax' + JSON.stringify(this.matchReserve));

    this.matchService.addMatch(this.matchReserve)
      .then(() => {
        loading.dismiss();

        this.appCtrl.getRootNav().setRoot(HomePage);
        this.toastSuccess('Partido Reservado')
        //  this.navCtrl.push(DetailTeamPage,{team:newTeam});
      }).catch((err) => {
        loading.dismiss();

        const alert = this.alertCtrl.create({
          title: 'Error Reservando',
          subTitle: err,
          buttons: ['OK']
        });
        alert.present();
      });

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

  available(teamToReserve: Team) {
    let assisTeam = [];
    for (let i = 0; i < teamToReserve.players.length; i++) {
      if (teamToReserve.players[i].state == 1) {
        assisTeam.push(teamToReserve.players[i]);
      }
    }
    return assisTeam.length
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


  private loading(textLoading: string) {
    let loading = this.loadingCtrl.create({
      content: textLoading
    });
    loading.present();
    return loading;
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
