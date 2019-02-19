import { ImagePicker } from '@ionic-native/image-picker';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { FieldsPage } from './../fields/fields';
import { FieldServiceProvider } from './../../providers/field-service/field-service';
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Field } from '../../models/field';
import { User } from '../../models/user';
import { ProfilePage } from '../profile/profile';
import { SetLocationPage } from '../set-location/set-location';
import { LocationField } from '../../models/locationField';
import { SetHoursPage } from '../set-hours/set-hours';
import { normalizeURL } from 'ionic-angular';
import { FirebaseImageServiceProvider } from '../../providers/firebase-image-service/firebase-image-service';

@Component({
  selector: 'page-add-field',
  templateUrl: 'add-field.html',
})
export class AddFieldPage {
  private todo: FormGroup;
  user: User;
  location: LocationField;
  locationIsSet: boolean;
  hours: string[];
  bandHours: boolean;
  nroImage = 0;
  constructor(public navCtrl: NavController,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public fieldService: FieldServiceProvider,
    public userService: UserServiceProvider,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public imagePicker: ImagePicker,
    public loadingCtrl: LoadingController,
    public firebaseImageService: FirebaseImageServiceProvider,
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
    console.log('ionViewDidLoad length' + this.fieldService.lengthListFields);
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

  getHours() {

    const modal = this.modalCtrl.create(SetHoursPage);
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.hours = data.hours;
          this.bandHours = true;
          console.log('hours hours' + JSON.stringify(this.hours));
          if (this.hours.length < 1) {
            this.bandHours = false;
          }
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
    if (!this.bandHours) {
      const alert = this.alertCtrl.create({
        title: 'No selecciono Horaios',
        subTitle: 'no hay horarios seleccionado',
        message: 'por favor ingrese valores',
        buttons:
          [
            {
              text: 'Si, Continuar',
              handler: () => {
                console.log('OK');
                this.getHours();
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
    if (this.nroImage == 0) {
      const alert = this.alertCtrl.create({
        title: 'No selecciono ninguna imagen',
        message: 'por favor ingrese al menos una imagen',
        buttons:
          [
            {
              text: 'Si, Continuar',
              handler: () => {
                console.log('OK');
                this.getImages();
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
    if (this.location == null) {
      this.location = {
        lat: -34.9964963,
        lng: -64.9672817
      };
      const alert = this.alertCtrl.create({
        title: 'No selecciono ubicacion',
        message: 'prosegir sin ubicacion',
        buttons:
          [
            {
              text: 'Si, Continuar',
              handler: () => {
                console.log('OK');
                this.onOpenMap();
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
      lat: this.location.lat,
      lng: this.location.lng
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
      hours: this.hours,
      countImages: this.nroImage
    }
    if (a.lat != null) {
      newField.location = a;
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

  getImages() {
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if (result == true) {
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  uploadImageToFirebase(image) {
    let loadingIni = this.loading('Cargando');
    image = normalizeURL(image);

    //uploads img to firebase storage
    this.firebaseImageService.uploadImage(image, this.fieldService.lengthListFields + 1, this.nroImage + 1)
      .then(photoURL => {
        this.nroImage = this.nroImage + 1;
        loadingIni.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Seleccionar Imagenes',
          message: 'Agregar otra imagen',
          buttons:
            [
              {
                text: 'Si, Continuar',
                handler: () => {
                  console.log('OK');
                  this.getImages();
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
      }).catch((err) => {
        loadingIni.dismiss();
      })
  }

  private loading(textLoading: string) {
    let loading = this.loadingCtrl.create({
      content: textLoading
    });
    loading.present();
    return loading;
  }

}
