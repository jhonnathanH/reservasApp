import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { Field } from '../../models/field';


@Injectable()
export class FieldServiceProvider {

  private fields: AngularFirestoreCollection<Field>;
  public listFields: Observable<Field[]>;
  lengthListFields: number = 0;
  fieldsStore: Field[] = [];
  constructor(public afs: AngularFirestore) {
    console.log('Hello TeamServiceProvider Provider');
    this.fields = afs.collection<Field>('fields');
    this.listFields = this.fields.snapshotChanges()
      .map(actions => {
        return actions.map(item => {
          const data = item.payload.doc.data() as Field;
          // console.log('team' + data);
          //console.log('team2' +  JSON.stringify(data));
          //console.log('this.listaNormalTeam' + JSON.stringify(this.listTeams));
          this.lengthListFields = actions.length;
          //     const id = item.payload.doc.id;
          return { ...data };
        })
      })
  }

  getField() {
    return this.listFields;
  }
  addFieldStore(x: Field[]) {
    this.fieldsStore = x;
    console.log('add  teamsStore');
  }

  getFieldStore() {
    return this.fieldsStore.slice();
  }

  getFieldByID(uid: string) {

  }

  addField(field: Field) {
    return this.fields.doc((this.lengthListFields + 1).toString()).set(field);
  }

  updateField(fieldID: number, field: Field) {
   
    this.listFields[fieldID] = field;
    console.log("succes load>" + JSON.stringify(this.listFields));
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('fields').doc(fieldID.toString()).set({
        field
      })
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
}



