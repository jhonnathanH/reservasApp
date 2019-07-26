import { LoginPage } from './../login/login';
import { FacebookServiceProvider } from './../../providers/facebook-service/facebook-service';
import { GooglePlus } from '@ionic-native/google-plus';
import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, Platform, Events, ActionSheetController } from 'ionic-angular';
import { User } from './../../models/user';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { AngularFireAuth } from 'angularfire2/auth';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { OneSignal } from '@ionic-native/onesignal';
import { FirebaseImageServiceProvider } from '../../providers/firebase-image-service/firebase-image-service';
import { ImagePicker } from '@ionic-native/image-picker';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userProfile: any = null;
  adminPassword = 1234;
  bandRoot: boolean;
  aux: any;
  // xuser$: any;
  constructor(public navCtrl: NavController,
    // private afAuth: AngularFireAuth,///
    public googlePlus: GooglePlus,
    private userService: UserServiceProvider,
    private auth: AuthServiceProvider,
    public toastCrl: ToastController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public firebaseService: FirebaseImageServiceProvider,
    public oneSignal: OneSignal,
    public imagePicker: ImagePicker,
    public events: Events,
    public facebook: FacebookServiceProvider,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {
    //console.log(JSON.stringify(this.userService.getStoreUser()) + 'constructor');
    this.userService.getStoreUser().then(
      (data) => {
        this.userProfile = data;
      }
    );
  }

  ionViewWillEnter() {
    //this.xuser$= this.userService.listUser;
    //this.xuser$.subscribe(data => console.log('z'+data.toString()) );

    this.userService.getUsers().subscribe(res => {
      this.aux = res;
      console.log(JSON.stringify(this.aux));
      let xString = res;
      console.log(xString);
      
      console.log("xString");
      let x: User[] = xString.sort((n1, n2) => {
        if (n1.name > n2.name) {
          return 1;
        }
        if (n1.name < n2.name) {
          return -1;
        }
        return 0;
      });

      this.userService.addUserStore(x);
    });
    this.events.subscribe('menu:userpic', () => {
      this.userService.getStoreUser().then(
        (data) => {
          this.userProfile = data;
          this.userService.addUser(this.userProfile).then(() => {
            this.toastSuccess();
          });
        }
      );
    });

  }

  upPhoto() {
    console.log(this.userProfile);
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
                this.take(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  take(imageData) {
    alert(imageData);
    console.log(this.userProfile);
    const loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 10000
    });
    loader.present();

    this.firebaseService.uploadImageProfile(imageData, this.userProfile.email, this.userProfile)

    setTimeout(() => {
      alert("user  success");
      this.userService.getStoreUser().then(
        (data) => {
          this.userProfile = data;
        }
      );
    }, 12000);


  }


  popoverGmailLogin() {
    let a: User;
    const loading = this.loadingCtrl.create({
      content: 'Iniciando...'
    });
    loading.present();
    this.auth.loginWithGoogle()
      .then((v) => {
        console.log("dtttdffff" + v.uid);
        a = {
          name: v.displayName,
          uid: v.uid,
          email: v.email,
          photoURL: v.photoURL,
          deviceID: '123456789'
        };
        console.log("ddffff" + a);
        loading.dismiss();
        return this.userService.addUser(a).then(() => {
          this.userService.storeUser(a);
          this.userProfile = a;
          this.toastSuccess();
        });
      }).catch(error => {
        loading.dismiss();
        this.showError(error + "singin");
      });
  }

  nativeGoogleLogin() {
    let a: User;
    console.log("11111");
    const loading = this.loadingCtrl.create({
      content: 'Iniciando...'
    });
    loading.present();
    this.auth.loginWithGoogleNative()
      .then((v) => {
        a = {
          name: v.displayName,
          uid: v.uid,
          email: v.email,
          photoURL: v.photoURL,
        };

        loading.dismiss();
        return this.oneSignal.getIds().then(success => {
          //Update  the database with onesignal_ID
          a.deviceID = success.userId
          this.userService.addUser(a).then(() => {
            this.userService.storeUser(a);
            this.userProfile = a;
            this.toastSuccess();
          });
        });
      })
      .catch(error => {
        loading.dismiss();
        this.showError(error + "singin");
      });
  }

  onSingin(form: NgForm) {
    let a: User;
    console.log('este' + form.value);
    const loading = this.loadingCtrl.create({
      content: 'Iniciando...'
    });
    loading.present();

    this.auth.signin(form.value.email, form.value.password)
      .then(data => {
        a = {
          name: form.value.name,
          uid: data.user.uid,
          email: form.value.email,
          photoURL: "",
        };
        for (let i = 0; i < this.aux.length; i++) {
          if (this.aux[i].email == a.email) {
            a.name = this.aux[i].name;
          }
        }

        console.log(JSON.stringify(data) + 'signin');
        loading.dismiss();
        return this.oneSignal.getIds().then(success => {
          //Update  the database with onesignal_ID
          a.deviceID = success.userId;
          this.userService.addUser(a).then(() => {
            this.userService.storeUser(a);
            this.userProfile = a;
            this.toastSuccess();
          });
        });
      })
      .catch(error => {
        loading.dismiss();
        this.showError(error + "singin");
      });
  }
  onSingup(form: NgForm) {
    let a: User;
    console.log(form.value);
    const loading = this.loadingCtrl.create({
      content: 'Iniciando...'
    });
    loading.present();

    this.auth.signup(form.value.email, form.value.password)
      .then(data => {
        a = {
          name: form.value.name,
          uid: data.user.uid,
          email: form.value.email,
          photoURL: "",
        };
        loading.dismiss();
        console.log('bienvenido+');
        console.log(JSON.stringify(data) + 'signup');

        return this.oneSignal.getIds().then(success => {
          //Update  the database with onesignal_ID
          a.deviceID = success.userId;
          this.userService.addUser(a).then(() => {
            this.userService.storeUser(a);
            this.userProfile = a;
            this.toastSuccess();
          });
        });
      })
      .catch(error => {
        loading.dismiss();
        this.showError(error);
      });

  }

  signOut() {
    this.userService.deleteUser();
    console.log("press Logout");

    this.navCtrl.setRoot(LoginPage);
    return this.auth.logoutUser();
  }

  doGoogleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.popoverGmailLogin()
    }
  }
  doFacebookLogin() {
    if (this.platform.is('cordova')) {
      this.nativeFbLogin();
    }
  }
  nativeFbLogin() {
    let a: User;
    this.facebook.login().subscribe((connected) => {   //We watch the observable to get connection status
      if (connected === true) {
        this.facebook.getProfile().subscribe((profile) => {   //If connected, we retrieve the profile
          let userFace = profile;
          this.toastSuccess();

          a = {
            name: userFace.name,
            uid: userFace.id,
            email: userFace.email,
            photoURL: userFace.picture.data.url,
          };

          return this.oneSignal.getIds().then(success => {
            //Update  the database with onesignal_ID
            a.deviceID = success.userId
            this.userService.addUser(a).then(() => {
              this.userProfile = a;
              this.userService.storeUser(this.userProfile);
              this.toastSuccess();
            });
          });
        })
          .catch(error => {
            this.showError(error + "singin");
          });
      }
    }, (error) => { console.log(error); });
  }

  root() {
    const rootPass = this.alertCtrl.create({
      title: 'Ingrese la Clave',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            if (data.password.trim() == '' || data.password == null) {
              const toast = this.toastCrl.create({
                message: 'por favor, ingrese una clave',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
              return;
            } else {
              if (this.adminPassword == data.password.trim()
                || this.adminPassword == data.password) {
                const toast = this.toastCrl.create({
                  message: 'Bienvenido Admin',
                  duration: 1500,
                  position: 'bottom'
                });
                toast.present();
                this.userService.storeRoot();
                this.bandRoot = true;
                return;
              }
              const toast = this.toastCrl.create({
                message: ' ¡Clave invalida!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
              return;
            }
          }
        }
      ]
    });
    rootPass.present();
  }


  private toastSuccess() {
    const toast = this.toastCrl.create({
      message: 'Login Completado, Bienvenido!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  private showError(error: any) {
    const alert = this.alertCtrl.create({
      title: 'Error en el Logeo',
      message: error,
      buttons: ['OK']
    });
    alert.present();
  }

  public getImageSheet() {


    const galeryOptions: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      targetWidth: 600,
      targetHeight: 600,
      correctOrientation: true
    };

    const cameraOptions: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 600,
      targetHeight: 600,
      correctOrientation: true
    };

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Agregar fotos',
      buttons: [
        {
          text: 'Galería',
          icon: 'images',
          handler: () => {
            this.takePick(galeryOptions)
          }
        }, {
          text: 'Cámara',
          icon: 'camera',
          handler: () => {
            this.takePick(cameraOptions);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();

  }

  takePick(cameraOptions: any) {

    this.camera.getPicture(cameraOptions).then((imageData) => {
      const loader = this.loadingCtrl.create({
        content: "Cargando...",
        duration: 8000
      });
      loader.present();
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

      this.firebaseService.uploadImagePic(imageData, this.userProfile.email, this.userProfile)
        .then(photoURL => {
          setTimeout(() => {
            loader.dismiss();
            //  this.sendFile(photoURL);
          }, 2000);
          //  acaaaaa; &&&&&&&&&&&&&&&&&&&&&&&&&&&&&
          this.userProfile.photoURL = photoURL;
          this.userService.addUser(this.userProfile).then(() => {
            this.userService.storeUser(this.userProfile);
            this.toastSuccess();
          });

        }).catch((err) => {
          loader.dismiss();
        })
    }, (err) => {
      // Handle error
    });
  }

}


