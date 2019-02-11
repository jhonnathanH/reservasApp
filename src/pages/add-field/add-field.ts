import { UserServiceProvider } from './../../providers/user-service/user-service';
import { FieldsPage } from './../fields/fields';
import { FieldServiceProvider } from './../../providers/field-service/field-service';
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController, ModalController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Field } from '../../models/field';
import { User } from '../../models/user';
import { ProfilePage } from '../profile/profile';
import { SetLocationPage } from '../set-location/set-location';
import { LocationField } from '../../models/locationField';

/**
 * Generated class for the AddFieldPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-field',
  templateUrl: 'add-field.html',
})
export class AddFieldPage {
  private todo: FormGroup;
  user: User;
  location: LocationField;
  locationIsSet: boolean;

  constructor(public navCtrl: NavController,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public fieldService: FieldServiceProvider,
    public userService: UserServiceProvider,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public navParams: NavParams) {

    this.userService.getStoreUser()
      .then(
        (user: User) => {
          this.user = user;
        }
      ).catch(
        err => {
          console.log(err);
        });

    this.todo = this.formBuilder.group({
      fieldName: ['', Validators.required],
      addres: ['', Validators.required],
      town: ['', Validators.required],
      city: ['', Validators.required],
      phone: [''],
      hours: [''],
      bufet: [''],
      sizeField: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFieldPage');
  }

  onOpenMap() {
    this.location = {
      lat: -34.9964963,
      lng: -64.9672817
    };
    const modal = this.modalCtrl.create(SetLocationPage,
      { location: this.location, isSet: this.locationIsSet });
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          console.log('location location' + JSON.stringify(this.location));
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate() {

  }

  onAddItem() {
    if (this.user == null) {
      const alert = this.alertCtrl.create({
        title: 'Debe Logearse',
        subTitle: '¿Esta seguro?',
        message: 'recuerde, logearse para continuar',
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
      return;
    }
    console.log('ffffpp' + this.todo.value.categoria);
    let a = {
      lat:this.location.lat,
      lng:this.location.lng
    }
    let newField: Field;
    newField = {
      id: this.fieldService.lengthListFields + 1,
      fieldName: this.todo.value.fieldName,
      addres: this.todo.value.addres,
      town: this.todo.value.town,
      city: this.todo.value.city,
      sizeField: this.todo.value.sizeField,
      phone: this.todo.value.phone,
      userCreate: this.user,
      location : a
    }
    if (this.locationIsSet) {
      console.log('location true');
     
    }

    this.fieldService.addField(newField)
      .then(() => {
        console.log("fieldsx" + (JSON.stringify(newField)));
        //this.playersService.removeAllPlayerstoTeam();
        this.todo.reset();
        this.appCtrl.getRootNav().setRoot(FieldsPage);
        //  this.navCtrl.push(DetailTeamPage,{team:newTeam});
      });

    console.log('sss DetailTeamPage');
    // const modal = this.modalCtrl.create(OrderPage, { customer: customer , order: null, index: null });
  }


}
