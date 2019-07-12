import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

@Injectable()
export class FacebookServiceProvider {
  session: any;
  constructor(public facebook: Facebook) {
    console.log('Hello FacebookServiceProvider Provider');
  }


  login() {
    //We return an observable to manage the asynchronous response
    return Observable.create(observer => {
      this.facebook.login(['email']).then((response) => {
        if (response.status === "connected") {
          this.session = response;
          observer.next(true);        //We return true or false according the connection status
          observer.complete();
          const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);
          return firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
            .then(suc => {
            //  alert("Firebase success: " + JSON.stringify(suc));

            }).catch(err => {
              alert("error " + JSON.stringify(err.message));
            })
        } else {
          observer.next(false);
          observer.complete();
        }
      }, (error) => {
        console.log(error);
      });
    });
  }

  getProfile() { // New method to return an observable with profile informations
    return Observable.create(observer => {
      if (this.session.status === "connected") {
        this.facebook.api("/me?fields=name,email,id,picture", ["public_profile", "email"]).then((response) => {
          console.log(response);
          observer.next(response);    //We return the Facebook response with the fields name and picture
          observer.complete();
        }, (error) => {
          console.log(error)
        });
      } else {
        observer.next(undefined);
        observer.complete();
      }
    });
  }
}
