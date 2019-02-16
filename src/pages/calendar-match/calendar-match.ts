import { MatchServiceProvider } from './../../providers/match-service/match-service';
import { SelectTeamPage } from './../select-team/select-team';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Match } from '../../models/match';
import { ProfilePage } from '../profile/profile';
import firebase from 'firebase';
import { User } from '../../models/user';
import { Field } from '../../models/field';


@Component({
  selector: 'page-calendar-match',
  templateUrl: 'calendar-match.html',
})
export class CalendarMatchPage {
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  dateMatch: any;
  cancha: string;
  reservesMatch: Match[] = [];
  bandShow: boolean;
  valueMaxDivHour = 14;
  userProfile: any;
  user: User;
  field: Field;
  listaMatch: Match[] = [];
  original: Match[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public alertCtrl: AlertController,
    public matchService: MatchServiceProvider,
    public loadingCtrl: LoadingController) {

    this.cancha = this.navParams.get("cancha");
    this.field = this.navParams.get("field");
    console.log(' this.field> ' + this.field);

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

    this.date = new Date();
    this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.getDaysOfMonth();
    this.getMacthsByDay();
    this.checkMatchs();
  }
  private getMacthsByDay() {
    this.reservesMatch = [];
    this.valueMaxDivHour = this.field.hours.length;
    for (let i = 0; i < this.valueMaxDivHour; i++) {
      let a: Match;
    
      a = {
        id: i,
        assis: false,
        day: this.currentDate,
        month: this.currentMonth,
        year: this.currentYear,
        field: this.field,
        hour: this.field.hours[i]
      };
      this.reservesMatch.push(a);
    }
  }

  selectDate(day: any) {
    let loadingIni = this.loading('Cargando');
    console.log('currentDay> ' + this.currentDate);
    console.log('dia es> ' + day);
    console.log('mes es> ' + this.currentMonth);
    console.log('año es> ' + this.currentYear);
    this.dateMatch = 'Disponibilidad para el Dia ' + day;
    this.currentDate = day;
    this.getMacthsByDay();
    this.checkMatchs();
    loadingIni.dismiss();
  }
  seeReserve(seeMatch: Match) {
    console.log('verrrr> ');
  }

  checkMatchs() {
    this.getMatchs();



  }

  private filesandcolumns() {
    for (let j = 0; j < this.listaMatch.length; j++) {
      // console.log('verrrrj> ' + j);
      for (let i = 0; i < this.reservesMatch.length; i++) {
        //console.log('verrrri ' + i);
        console.log(this.listaMatch[j].day + 'verrrri ' + this.reservesMatch[i].day);
        if (this.listaMatch[j].day == this.reservesMatch[i].day &&
          this.listaMatch[j].month == this.reservesMatch[i].month &&
          this.listaMatch[j].year == this.reservesMatch[i].year &&
          this.listaMatch[j].hour == this.reservesMatch[i].hour) {
          console.log(j + 'pass> ' + i);
          // this.reservesMatch[i] = this.listaMatch[j];
          this.reservesMatch[i].assis = this.listaMatch[j].assis;
          console.log('pass> ' + this.reservesMatch[i].assis);
          //console.log(JSON.stringify(this.reservesMatch[i]));
        }
      }
    }
  }

  private getMatchs() {
    this.matchService.getMatchs().subscribe(res => {
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.matchService.addMatchStore(x);
      this.listaMatch = x;
      this.original = x;

      this.filesandcolumns();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.matchService.getMatchsStore()) {
      console.log('sssACA');
      let x = this.matchService.getMatchsStore();
      this.listaMatch = x;
      this.original = x;
      this.filesandcolumns();
    }
    //console.log('ss' + JSON.stringify(this.listaMatch) + 'ss');
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
      this.dateMatch = 'Disponibilidad para el Dia ' + this.currentDate;
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for (let i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    console.log(thisNumOfDays + 'acathisNumOfDays');
    for (let i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i + 1);
    }
    console.log(JSON.stringify(this.daysInThisMonth) + 'daysInThisMonth');

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    // var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
    for (let i = 0; i < (6 - lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i + 1);
    }
    var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (let i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }
  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }
  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }
  // este metodo servira para buscar si ya esta ocupado.... meterlo en el servicio
  //   getMovie(id: number): Observable<Movie> {
  //     return this.getMovies()
  //     .map(movies => movies.find(movie => movie.id == id));
  // }

  show() {
    this.bandShow = !this.bandShow;
  }

  reserve(reserva: string) {
    let matchReserve: Match;
    matchReserve = {
      id: 0,
      day: this.currentDate,
      month: this.currentMonth,
      year: this.currentYear,
      field: this.field,
      hour: reserva
    }
    console.log('reserva  ' + JSON.stringify(matchReserve));
    //this.navCtrl.push(DetailTeamPage, { team: reserva });

    if (this.userProfile) {
      console.log('this.usergetUser' + JSON.stringify(this.userProfile));
      this.navCtrl.push(SelectTeamPage, { matchReserve: matchReserve, user: this.userProfile });
    } else {
      const alert = this.alertCtrl.create({
        title: 'Debe Logearse',
        subTitle: '¿Esta seguro?',
        message: 'recuerde, logearse para reservar',
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
  getUser() {
    this.userService.getStoreUser()
      .then(
        (user: User) => {
          this.user = user;
          //
        }
      ).catch(
        err => {
          console.log(err);
        });
  }

  private loading(textLoading: string) {
    let loading = this.loadingCtrl.create({
      content: textLoading
    });
    loading.present();
    return loading;
  }
}

