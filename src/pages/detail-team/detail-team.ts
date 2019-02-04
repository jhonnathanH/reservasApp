import { UserServiceProvider } from './../../providers/user-service/user-service';
import { TeamServiceProvider } from './../../providers/team-service/team-service';
import { PlayersPage } from './../players/players';
import { PlayersServiceProvider } from './../../providers/players-service/players-service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, Platform, ToastController } from 'ionic-angular';
import { Team } from '../../models/team';
import { User } from '../../models/user';
import { OneSignal } from '@ionic-native/onesignal';

/**
 * Generated class for the DetailTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-team',
  templateUrl: 'detail-team.html',
})
export class DetailTeamPage {
  team: Team;
  bandLength: boolean;
  user: User;
  bandLeader: boolean;
  here: boolean;
  originalPlayers: User[];
  assisTeam: User[];
  constructor(public teamService: TeamServiceProvider,
    public playersService: PlayersServiceProvider,
    public userService: UserServiceProvider,
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public oneSignal: OneSignal,
    public toastCrl: ToastController,
    public navParams: NavParams) {
    this.user = this.navParams.get("user");
    this.team = this.navParams.get("team");
    if (this.user.uid == this.team.leadUser.uid) {
      this.bandLeader = true;
    }
    if (this.team != null) {
      this.originalPlayers = this.team.players;
      for (let i = 0; i < this.team.players.length; i++) {
        if (this.team.players[i].uid == this.user.uid) {
          console.log(this.user.name + 'userX');
          this.here = true;
        }
        this.playersService.addPlayerstoTeam(this.team.players[i]);
      }
    }

    // this.userService.getStoreUser()
    //   .then(
    //     (user: User) => {
    //       this.user = user;
    //       if (this.user.uid == this.team.leadUser.uid) {
    //         this.bandLeader = true;
    //       }
    //     }
    //   ).catch(
    //     err => {
    //       console.log(err);
    //     });
  }

  ionViewWillEnter() {
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

  ionViewWillLeave() {
    // this.playersService.removeAllPlayerstoTeam();
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
            break;
          case 2:
            this.team.players[index].state = 3;
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
    this.teamService.updateTeam(this.team.id, {
      id: this.team.id,
      name: this.team.name,
      leadUser: this.team.leadUser,
      sizeTeam: this.team.sizeTeam,
      players: this.team.players
    });
  }

  askAdd() {
    this.user.state = 3;
    this.playersService.addPlayerstoTeam(this.user);
    this.team.players = this.playersService.getPlayers();
    this.updateTeam();
    this.here = true;
  }

  cancel() {
    this.playersService.removeAllPlayerstoTeam();
    this.team.players = this.originalPlayers;
    this.viewCtrl.dismiss();
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
    for (let i = 0; i < this.team.players.length; i++) {
      let reciever_ID = this.team.players[i].deviceID;
      ///Push The Notification
      if (this.platform.is('cordova')) {
        let notificationObj: any = {
          include_player_ids: reciever_ID,
          contents: { en: "Hello, This Is My First Notification With Onesignal" },
        };

        this.oneSignal.postNotification(notificationObj).then(success => {
          console.log("Notification Post Success:", success);
        }, error => {
          console.log(error);
          alert("Notification Post Failed:\n" + JSON.stringify(error));
        });

      }

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
