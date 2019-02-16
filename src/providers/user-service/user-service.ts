import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
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
  userStore: User[] = [];
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

  getUsers() {
    return this.listUser;
  }
  addUserStore(x: User[]) {
    this.userStore = x;
    console.log('add  addUserStore');
  }

  getUserStore() {
    return this.userStore.slice();
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

  storeRoot() {

    this.storage.set('storeRoot', true)
      .then(
        data => { }
      )
      .catch(
        err => {
          console.log(err);
        }
      );
  }


  getStoreRoot() {
    return this.storage.get('storeRoot')
      .then(
        (band: boolean) => {
          return band;
        }
      ).catch(
        //toast
        err => console.log(err)
      );
  }
}