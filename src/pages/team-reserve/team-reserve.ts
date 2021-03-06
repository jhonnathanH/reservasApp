import { MatchServiceProvider } from './../../providers/match-service/match-service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import { Team } from '../../models/team';
import { User } from '../../models/user';
import { PlayersServiceProvider } from '../../providers/players-service/players-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { OneSignal } from '@ionic-native/onesignal';
import { Match } from '../../models/match';
import { PlayersPage } from '../players/players';

@Component({
  selector: 'page-team-reserve',
  templateUrl: 'team-reserve.html',
})
export class TeamReservePage {
  userProfile: any
  team: Team;
  match: Match;
  bandLength: boolean;
  user: User;
  bandLeader: boolean;
  here: boolean;
  originalPlayers: User[];
  assisTeam: User[];
  constructor(public matchService: MatchServiceProvider,
    public playersService: PlayersServiceProvider,
    public userService: UserServiceProvider,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public oneSignal: OneSignal,
    public toastCrl: ToastController,
    public navParams: NavParams) {

    this.team = this.navParams.get("team");
    this.match = this.navParams.get("match");
    this.getUserb();

  }

  private act() {
    if (this.team != null && this.user != null) {
      this.originalPlayers = this.team.players;
      for (let i = 0; i < this.team.players.length; i++) {
        if (this.team.players[i].uid == this.user.uid) {
          console.log(this.user.name + 'userX');
          this.here = true;
        }
        this.playersService.addPlayerstoTeam(this.team.players[i]);
      }
    }
    this.loadPalyers();
  }

  private getUserb() {
    this.userService.getStoreUser().then((data) => {
      this.userProfile = data;
      if (this.userProfile != null) {
        this.user = this.userProfile;
        if (this.user.uid == this.team.leadUser.uid) {
          this.bandLeader = true;
        }
        this.act();
      }
    });
  }

  ionViewWillEnter() {

  }

  private loadPalyers() {
    this.team.players = this.playersService.getPlayers();
    console.log(this.team.sizeTeam + 'teamSizexx');
    console.log(this.team.players.length + 'lengthxxx');
    this.getValidAssis();
    for (let i = 0; i < this.team.players.length; i++) {
      if (this.team.players[i].uid == this.user.uid) {
        this.here = true;
      }
    }
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
    this.getValidAssis();
  }


  addPlayer() {
    console.log(this.team.sizeTeam + 'teamSize');
    console.log(this.team.players.length + 'length');

    if (this.team.sizeTeam > this.assisTeam.length) {
      this.navCtrl.push(PlayersPage, { players: this.team.players });
    }
  }

  update() {
    this.playersService.removeAllPlayerstoTeam();
    this.updateTeam();
    this.navCtrl.pop();
    this.sendpush();
  }

  changeState(index: number) {
    if (this.bandLeader) {
      let value = this.team.players[index].state;
      switch (value) {
        case 1:
          console.log(index + '22222');
          this.team.players[index].state = 2;
          break;
        case 2:
          if (!this.bandLength) {
            this.team.players[index].state = 1;
          }

          break;
        case 3:
          if (!this.bandLength) {
            this.team.players[index].state = 1;
          }
          break;
      }
    } else {
      if (this.user.uid == this.team.players[index].uid) {
        let value = this.team.players[index].state;
        switch (value) {
          case 1:
            console.log(index + '22222');
            this.team.players[index].state = 2;
            this.sendpushByID(this.team.leadUser.deviceID, this.user.name, ' cancelo la asistencia ');
            break;
          case 2:
            this.team.players[index].state = 3;
            this.sendpushByID(this.team.leadUser.deviceID, this.user.name, ' solicito unirse ');
            break;
          case 3:
            this.team.players[index].state = 2;
            break;
        }
        this.updateTeam();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Accion no permitida',
          message: 'No Puede Cambiar el estado de otro jugador',
          buttons: ['OK']
        });
        alert.present();
      }
    }
    this.getValidAssis();
  }


  private updateTeam() {
    this.match.team = this.team;
    this.matchService.updateMatch(this.match.id, this.match);
  }

  askAdd() {
    this.user.state = 3;
    this.playersService.addPlayerstoTeam(this.user);
    this.team.players = this.playersService.getPlayers();
    this.updateTeam();
    this.here = true;
    this.sendpushByID(this.team.leadUser.deviceID, this.user.name, ' solicito unirse ');
  }

  cancel() {
    this.playersService.removeAllPlayerstoTeam();
    this.team.players = this.originalPlayers;
    this.navCtrl.pop();
  }

  private getValidAssis() {
    this.assisTeam = [];
    for (let i = 0; i < this.team.players.length; i++) {
      if (this.team.players[i].state == 1) {
        this.assisTeam.push(this.team.players[i]);
      }
      //this.playersService.addPlayerstoTeam(this.team.players[i]);
    }

    if (this.team.sizeTeam == this.assisTeam.length) {
      this.bandLength = true;
    } else {
      this.bandLength = false;
    }
  }

  //TODO PARA PUSH NOTIFICATION
  sendpush() {
    for (let i = 1; i < this.team.players.length; i++) {
      let reciever_ID = this.team.players[i].deviceID;
      ///Push The Notification
      if (this.platform.is('cordova')) {
        let notificationObj: any = {
          include_player_ids: [reciever_ID],
          contents: { en: this.team.leadUser.name + ' te ha invitado/actualizo ' + this.team.name + ' ' + this.match.day + '/' + this.match.month + '/' + this.match.year + ' ' + this.match.hour },
          data: { idTeam: this.team.id, bandNot: false },
        };

        this.oneSignal.postNotification(notificationObj).then(success => {
          console.log("Notification Post Success:", success);
          this.toastSuccess('Se envio notificaciones a los jugadores');
        }, error => {
          console.log(error);
          alert("Notification Post Failed:\n" + JSON.stringify(error));
        });
      }
    }
  }
  sendpushByID(id: string, name: string, msg: string) {
    let reciever_ID = id;
    ///Push The Notification
    if (this.platform.is('cordova')) {
      let notificationObj: any = {
        include_player_ids: [reciever_ID],
        contents: { en: name + msg + ' al equipo ' + this.team.name + ' ' + this.match.day + '/' + this.match.month + '/' + this.match.year + ' ' + this.match.hour },
        data: { idTeam: this.team.id, bandNot: false },
      };
      this.oneSignal.postNotification(notificationObj).then(success => {
        console.log("Notification Post Success:", success);
        this.toastSuccess('Se envio la notificación al Lider');
      }, error => {
        console.log(error);
        alert("Notification Post Failed:\n" + JSON.stringify(error));
      });
    }
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
