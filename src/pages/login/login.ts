
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { OneSignal } from '@ionic-native/onesignal';
import { FacebookServiceProvider } from '../../providers/facebook-service/facebook-service';
import firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SkipPage } from '../skip/skip';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userProfile: any = null;
  adminPassword = 1234;
  bandRoot: boolean;
  band1: boolean;
  band2: boolean;
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
    public oneSignal: OneSignal,
    public facebook: FacebookServiceProvider,
    public loadingCtrl: LoadingController) {
    //console.log(JSON.stringify(this.userService.getStoreUser()) + 'constructor');
    this.userService.getStoreUsers().then(
      (data) => {
        if(data){
          this.aux = data;
          console.log("##########  001" + JSON.stringify(this.aux.length));
        }
        
      }
    );
    this.userService.getStoreUser().then(
      (data) => {
        this.userProfile = data;
        console.log("##########  1" + JSON.stringify(this.userProfile));
      }
    );
  }

  ionViewWillEnter() {
    //this.xuser$= this.userService.listUser;
    //this.xuser$.subscribe(data => console.log('z'+data.toString()) );
    console.log("##########  11");
    this.userService.getUsers().subscribe(res => {
      this.aux = res;
      this.userService.storeUsers(this.aux);
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
          this.navCtrl.setRoot(SkipPage);
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
            this.navCtrl.setRoot(SkipPage);
          });
        });
      })
      .catch(error => {
        loading.dismiss();
        this.showError(error + "singin");
      });
  }
  bandUp() {
    this.band2 = true;
    this.band1 = false;
  }
  bandLog() {
    this.band1 = true;
    this.band2 = false;
  }

  onSingin(form: NgForm) {
    let a: User;
    console.log('este' + JSON.stringify(form.value));
    const loading = this.loadingCtrl.create({
      content: 'Iniciando...'
    });
    loading.present();

    this.auth.signin(form.value.email, form.value.password)
      .then(data => {
        if (data) {
          console.log("##########  2");

          a = {
            name: "",
            uid: data.user.uid,
            email: form.value.email,
            photoURL: "",
          };

          console.log("##########  2.1" + JSON.stringify(a));
          for (let i = 0; i < this.aux.length; i++) {
            if (this.aux[i].email == a.email) {
              a.name = this.aux[i].name;
              a.photoURL = this.aux[i].photoURL;
            }
          }

          console.log(JSON.stringify(data) + 'signin');
          loading.dismiss();
          if (this.platform.is('cordova')) {
            this.oneSignal.getIds().then(success => {
              //Update  the database with onesignal_ID
              a.deviceID = success.userId;
              this.userService.addUser(a).then(() => {
                this.userService.storeUser(a);
                this.userProfile = a;
                this.toastSuccess();
                this.navCtrl.setRoot(SkipPage);
              });
            });
          } else {
            console.log("##########  3");
            console.log("##########  4" + JSON.stringify(a));
            this.userService.addUser(a).then(() => {
              this.userService.storeUser(a);
              this.userProfile = a;
              console.log("##########  43" + JSON.stringify(a));
              this.toastSuccess();
              this.navCtrl.setRoot(SkipPage);
            }).catch(err =>
              console.log("##########  4 err" + JSON.stringify(err)));
          }
        }
      })
      .catch(error => {
        loading.dismiss();
        console.log("##########  1");
        this.showError(error + " singin");
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
        if (this.platform.is('cordova')) {
          this.oneSignal.getIds().then(success => {
            //Update  the database with onesignal_ID
            a.deviceID = success.userId;
            this.userService.addUser(a).then(() => {
              this.userService.storeUser(a);
              this.userProfile = a;
              this.toastSuccess();
              this.navCtrl.setRoot(SkipPage);
            });
          });
        } else {
          this.userService.addUser(a).then(() => {
            this.userService.storeUser(a);
            this.userProfile = a;
            this.toastSuccess();
            this.navCtrl.setRoot(SkipPage);
          });
        }
      })
      .catch(error => {
        loading.dismiss();
        this.showError(error);
      });

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
              this.userService.storeUser(a);
              this.toastSuccess();
              this.navCtrl.setRoot(SkipPage);
            });
          });
        })
          .catch(error => {
            this.showError(error + "singin");
          });
      }
    }, (error) => { console.log(error); });
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
}


