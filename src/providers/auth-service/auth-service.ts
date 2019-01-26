import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http, private afAuth: AngularFireAuth) {
    console.log('Hello AuthServiceProvider Provider');
  }
  
  signup(email: string, pass: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, pass);
  }
  getUser(): Observable<User>{
    return this.afAuth.authState
    .take(1)
    .filter(user => !!user) // info evitar usuario nulo...
    .map((user : firebase.User)=> {
      return user as User;
    });
  }

  loginWithGoogle() :Promise<any>{
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.afAuth.auth.signInWithPopup(provider)
    .then(result=> {
      console.log(result);
     return result.user;
    })
    .catch(err=> console.log(err));
  }
}
