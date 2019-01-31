import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Match } from '../../models/match';

/**
 * Generated class for the CalendarMatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  bandShow:boolean;
  valueMaxDivHour = 14;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.cancha = this.navParams.get("cancha");
    console.log(' this.canch> ' + this.cancha);

  }

  ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.getDaysOfMonth();
    for (let i = 0; i < this.valueMaxDivHour; i++) {
      let a: Match;
      let numHourMin=9+i;
      let numHourMax=10+i;
      a = {
        id: i,
        day: this.currentDate,
        month: this.currentMonth,
        year: this.currentYear,
        field: Number(this.cancha),
        hour: numHourMin+':00 - '+numHourMax+':00'
      }
      this.reservesMatch.push(a);
    }
  }
  selectDate(day: any) {
    console.log('currentDay> ' + this.currentDate);
    console.log('dia es> ' + day);
    console.log('mes es> ' + this.currentMonth);
    console.log('año es> ' + this.currentYear);
    this.dateMatch = 'Disponibilidad para el Dia ' + day;
    this.currentDate = day;
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

  reserve(reserva: number) {
    let matchReserve: Match;
    matchReserve = {
      id: 0,
      day: this.currentDate,
      month: this.currentMonth,
      year: this.currentYear,
      field: Number(this.cancha),
      hour: reserva.toString()
    }
    console.log('reserva  ' + JSON.stringify(matchReserve));
    //this.navCtrl.push(DetailTeamPage, { team: reserva });
  }

  // este metodo servira para buscar si ya esta ocupado.... meterlo en el servicio
  //   getMovie(id: number): Observable<Movie> {
  //     return this.getMovies()
  //     .map(movies => movies.find(movie => movie.id == id));
  // }

  show(){
    this.bandShow=!this.bandShow;
  }
}

