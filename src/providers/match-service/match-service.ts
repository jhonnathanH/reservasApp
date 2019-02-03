import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
@Injectable()
export class MatchServiceProvider {

  private matchs: AngularFirestoreCollection<Match>;
  public listMatchs: Observable<Match[]>;
  lengthListMatchs: number = 0;
  matchsStore: Match[] = [];
  constructor(public afs: AngularFirestore) {
    console.log('Hello MatchServiceProvider Provider');
    this.matchs = afs.collection<Match>('matchs');
    this.listMatchs = this.matchs.snapshotChanges()
      .map(actions => {
        return actions.map(item => {
          const data = item.payload.doc.data() as Match;
          console.log('matchs' + data);
          // console.log('this.listaNormalTeam' + JSON.stringify(this.listaNormalTeam));
          this.lengthListMatchs = actions.length;
          //     const id = item.payload.doc.id;
          return { ...data };
        })
      })
  }

  getMatchs() {
    return this.listMatchs;
  }
  addMatchStore(x: Match[]) {
    this.matchsStore = x;
    console.log('add  matchsStore');
  }

  getMatchsStore() {
    return this.matchsStore.slice();
  }

  getTeamByID(uid: string) {
  
  }
    addMatch(match: Match) {
      return this.matchs.doc((this.lengthListMatchs + 1).toString()).set(match);
    }

    updateMatch(matchID: number, match: Match) {
     // let a = new Team(team.id,
     //   team.name,
     //   team.leadUser,
     //   team.sizeTeam,
     //   team.players);
     //----- this.listMatchs[teamID] = a;
      console.log("succes load>" + JSON.stringify(match));
      return new Promise<any>((resolve, reject) => {
        this.afs.collection('matchs').doc(matchID.toString()).set({
          id: match.id,
          day: match.day,
          month: match.month,
          year: match.year,
          hour: match.hour,
          field: match.field,
          team: match.team,
          assis:match.assis
        })
          .then(
            res => resolve(res),
            err => reject(err)
          )
      })
    }
  }

