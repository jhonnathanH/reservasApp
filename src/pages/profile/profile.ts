import { GooglePlus } from '@ionic-native/google-plus';
import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, Platform } from 'ionic-angular';
import { User } from './../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userProfile: any = null;
  // xuser$: any;
  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public googlePlus: GooglePlus,
    private userService: UserServiceProvider,
    private auth: AuthServiceProvider,
    public toastCrl: ToastController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController) {
    console.log("ssddrrr");

  }

  ionViewWillEnter() {
    //this.xuser$= this.userService.listUser;
    //this.xuser$.subscribe(data => console.log('z'+data.toString()) );
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userProfile = user;
        console.log("syyyyy");
      } else {
        this.userProfile = null;
      }
    });
  }


  popoverGmailLogin() {
    let a: User;
    this.auth.loginWithGoogle()
      .then((v) => {
        console.log("dtttdffff" + v.uid);
        a = {
          name: v.displayName,
          uid: v.uid,
          email: v.email,
          photoURL: v.photoURL,
        };
        console.log("ddffff" + a);
        return this.userService.addUser(a).then(() => {
          this.userService.storeUser(a);
        });
      })
      .catch(console.log);

  }
  xnativeGoogleLogin() {
    let a: User;
    console.log("11111");
    this.auth.loginWithGoogleNative()
      .then((data) => {
        let v =data;
        console.log("googleLogin!!!" + JSON.stringify(v));
        a = {
          name: v.displayName,
          uid: v.userId,
          email: v.email,
          photoURL: v.imageURL,
        };
        console.log("ddffff" + a);
        //return this.userService.addUser(a).then(() => {
       //   this.userService.storeUser(a);
       // });
      })
      .catch(console.log);

  }

  nativeGoogleLogin() {
    this.googlePlus.login({
      'webClientId': '754165434495-gl8qtt77f0m8o177kqr55njs9c7l3a37.apps.googleusercontent.com',
      'offline': true
    })
      .then(res => {
        firebase.auth().signInAndRetrieveDataWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(suc => {
            console.log(suc);
            this.toastSuccess();

          })
          .catch(err => this.showError(err));
      })
      .catch((err) => {
        this.showError(err);
        console.log(err);
        this.popoverGmailLogin();
      });

  }

  onSingin(form: NgForm) {
    console.log('este' + form.value);
  }
  onSingup(form: NgForm) {
    console.log(form.value);
    const loading = this.loadingCtrl.create({
      content: 'Logeando...'
    });
    loading.present();
    let a = {
      name: form.value.name,
      uid: Math.random().toString() + new Date().getUTCMilliseconds(),
      email: form.value.email,
      photoURL: "",
    };
    this.auth.signup(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
        return this.userService.addUser(a).then(() => {
          this.userService.storeUser(a);
          this.toastSuccess();
        });
      })
      //.catch(error => console.log(error));
      .catch(error => {
        this.showError(error);
      });

  }

  signOut(): Promise<void> {
    console.log("press Logout");
    return this.afAuth.auth.signOut();
  }

  doGoogleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.popoverGmailLogin()
    }
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


