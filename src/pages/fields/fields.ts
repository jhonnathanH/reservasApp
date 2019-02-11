import { PopOverMapsPage } from './../../popover/popover-maps-options';
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { CalendarMatchPage } from '../calendar-match/calendar-match';
import { AddFieldPage } from '../add-field/add-field';
import { Field } from '../../models/field';
import { FieldServiceProvider } from '../../providers/field-service/field-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { DetailFieldPage } from '../detail-field/detail-field';

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
  bandSeeMap: boolean;
  searchTerm: string = '';
  selectSerch = false;
  lat: number = -34.9964963;
  lng: number = -64.9672817;
  zoomValue = 5;

  listaField: Field[] = [];
  original: Field[];
  constructor(public navCtrl: NavController,
    public fieldService: FieldServiceProvider,
    public toastCrl: ToastController,
    public userService: UserServiceProvider,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams) {


    this.fieldService.getField().subscribe(res => {
      let loadingIni = this.loading('Cargando');
      // ordernar sort
      // this.res.sort((a1, b1) => new Date(a1.created.toDate()).getTime() - new Date(b1.created.toDate()).getTime());
      let x = res.sort((n1, n2) => n1.id - n2.id);
      this.fieldService.addFieldStore(x);
      this.listaField = x;
      //toddoooooo metodo para ver las reservasssssss
      this.original = x;
      //save Team
      loadingIni.dismiss();
      //  console.log('ss' + JSON.stringify(this.listaTeam) + 'ss');
    });
    if (this.fieldService.getFieldStore()) {
      console.log('sssACA');
      let x = this.fieldService.getFieldStore();
      this.listaField = x;
      //toddoooooo metodo para ver las reservasssssss
      this.original = x;
      this.toastSuccess('Equipos Cargados');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FieldsPage');
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
  goToDetail(field: Field) {
    this.navCtrl.push(DetailFieldPage, { field: field });
  }

  goToCalendar(nomCancha: string) {
    console.log('nomCancha' + nomCancha);
    this.navCtrl.push(CalendarMatchPage, { cancha: nomCancha });
  }

  zoomField() {
    this.zoomValue = 16;
    this.lat = -34.679764;
    this.lng = -58.397630;

  }

  searchTeams() {

    this.listaField = this.original;
    // if the search term is an empty string return all items
    if (!this.searchTerm) {
      return this.listaField;
    }

    // Filter recipes
    this.listaField = this.listaField.filter((item) => {
      return item.fieldName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  ifSelect() {
    return this.selectSerch;
  }
  onSearch() {
    this.selectSerch = true;
    this.bandSeeMap = true;
  }
  onCancel(event) {
    console.log(event);
    this.selectSerch = false;
  }


  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(PopOverMapsPage);
    popover.present({ ev: event });
    popover.onDidDismiss(
      data => {
        if (data) {
          if (data.action == 'show') {
            console.log('primero');
            this.bandSeeMap = true;
          } else if (data.action == 'create') { //create
            console.log('segundo');
            this.navCtrl.push(AddFieldPage);

          }
        }
      });
  }

}
