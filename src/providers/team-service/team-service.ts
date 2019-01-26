import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { Team } from '../../models/team';

@Injectable()
export class TeamServiceProvider {
  private teams: AngularFirestoreCollection<Team>;
  public listTeams: Observable<Team[]>;
  lengthListTeams: number = 0;
  constructor(public afs: AngularFirestore) {
    console.log('Hello TeamServiceProvider Provider');
    this.teams = afs.collection<Team>('teams');
    this.listTeams = this.teams.snapshotChanges()
      .map(actions => {
        return actions.map(item => {
          const data = item.payload.doc.data() as Team;
          console.log('team' + data);
          this.lengthListTeams = actions.length;
          //     const id = item.payload.doc.id;
          return { ...data };
        })
      })
  }
  
  addTeam(team: Team) {
    return this.teams.doc((this.lengthListTeams + 1).toString()).set(team);
  }


}
