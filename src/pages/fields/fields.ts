import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CalendarMatchPage } from '../calendar-match/calendar-match';

/**
 * Generated class for the FieldsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fields',
  templateUrl: 'fields.html',
})
export class FieldsPage {
  searchTerm: string = '';
  selectSerch = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FieldsPage');
  }

  goToCalendar(nomCancha: string) {
    console.log('nomCancha'+nomCancha);
    this.navCtrl.push(CalendarMatchPage, { cancha: nomCancha });
  }
  //CalendarMatchPage

  searchProducts() {
    // Reset customers array back to all of the items
    // this.prodlistTeamsucts = this.teamService.listTeams;
    // // if the search term is an empty string return all items
    // if (!this.searchTerm) {
    //   return this.products;
    // }

    // Filter recipes
    //this.products = this.products.filter((item) => {
    //  return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    //});
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

}
