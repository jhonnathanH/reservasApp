import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import { User } from '../../models/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { Storage } from '@ionic/storage';
@Injectable()
export class UserServiceProvider {

  private users: AngularFirestoreCollection<User>;
  collection: AngularFirestoreCollection<User> = this.afs.collection('user')
  public listUser: Observable<User[]>;

  constructor(public afs: AngularFirestore, public storage: Storage) {
    this.users = afs.collection<User>('user');
    this.listUser = this.users.snapshotChanges()
      .map(actions => {
        return actions.map(item => {
          const data = item.payload.doc.data() as User;
          console.log('data' + data);
          return { ...data };
        })
      })
  }

  addUser(user: User) {

    return this.users.doc(user.uid).set(user);
  }

  storeUser(storeUser: User) {

    this.storage.set('storeUser', storeUser)
      .then(
        data => { }
      )
      .catch(
        err => {
          console.log(err);
        }
      );
  }


  getStoreUser() {
    return this.storage.get('storeUser')
      .then(
        (user: User) => {
          return user;
        }
      ).catch(
        //toast
        err => console.log(err)
      );
  }

  deleteUser() {
    this.storage.remove('storeUser');
  }

}