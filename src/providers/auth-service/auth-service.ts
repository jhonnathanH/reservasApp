import { GooglePlus } from '@ionic-native/google-plus';
import { AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http, private afAuth: AngularFireAuth,
    public alertCtrl:AlertController,
    public toastCrl:ToastController,
    public googlePlus: GooglePlus) {
    console.log('Hello AuthServiceProvider Provider');
  }

  signup(email: string, pass: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, pass);
  }
  getUser(): Observable<User> {
    return this.afAuth.authState
      .take(1)
      .filter(user => !!user) // info evitar usuario nulo...
      .map((user: firebase.User) => {
        return user as User;
      });
  }

  loginWithGoogle(): Promise<any> {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.afAuth.auth.signInWithPopup(provider)
      .then(result => {
        console.log(result);
        return result.user;
      })
      .catch(err => console.log(err));
  }
  loginWithGoogleNative(): Promise<any> {
    return this.googlePlus.login({
      'webClientId': '416991332199-grlumqdmjpftnocitghp6fhq4n0gbd9v.apps.googleusercontent.com',
      'offline': true
    })
      .then(res => {
        return firebase.auth().signInAndRetrieveDataWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(suc => {
            console.log("Firebase success: " + JSON.stringify(suc));
            this.toastSuccess();
            

          })
          .catch(err => this.showError(err));
      })
      .catch((err) => {
        this.showError(err);
        console.log(err);
      });
  }

  private showError(error: any) {
    const alert = this.alertCtrl.create({
      title: 'Error en el Logeo',
      message: error,
      buttons: ['OK']
    });
    alert.present();
  }
  private toastSuccess() {
    const toast = this.toastCrl.create({
      message: 'Login Completado, Bienvenido!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
