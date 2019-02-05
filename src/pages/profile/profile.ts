import { GooglePlus } from '@ionic-native/google-plus';
import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, Platform } from 'ionic-angular';
import { User } from './../../models/user';
//import { AngularFireAuth } from 'angularfire2/auth';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { OneSignal } from '@ionic-native/onesignal';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userProfile: any = null;
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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(JSON.stringify(this.userService.getStoreUser()) + 'userrrr');
        this.userService.getStoreUser().then(
          (data) => {
            this.userProfile = data;
          }
        );
      } else {
        this.userProfile = null;
      }
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

  signOut(): Promise<void> {
    this.userService.deleteUser();
    console.log("press Logout");
    return this.auth.logoutUser();
    //return this.afAuth.auth.signOut();
  }

  doGoogleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.popoverGmailLogin()
    }
  }

  upPhoto() {

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


