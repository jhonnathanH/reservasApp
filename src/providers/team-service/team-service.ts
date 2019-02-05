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
  teamsStore: Team[] = [];
  constructor(public afs: AngularFirestore) {
    console.log('Hello TeamServiceProvider Provider');
    this.teams = afs.collection<Team>('teams');
    this.listTeams = this.teams.snapshotChanges()
      .map(actions => {
        return actions.map(item => {
          const data = item.payload.doc.data() as Team;
          console.log('team' + data);
          console.log('team2' +  JSON.stringify(data));
          console.log('this.listaNormalTeam' + JSON.stringify(this.listTeams));
          this.lengthListTeams = actions.length;
          //     const id = item.payload.doc.id;
          return { ...data };
        })
      })
  }

  getTeams() {
    return this.listTeams;
  }
  addTeamsStore(x: Team[]) {
    this.teamsStore = x;
    console.log('add  teamsStore');
  }

  getTeamsStore() {
    return this.teamsStore.slice();
  }

  getTeamByID(uid: string) {
  
  }
    addTeam(team: Team) {
      return this.teams.doc((this.lengthListTeams + 1).toString()).set(team);
    }

    updateTeam(teamID: number, team: Team) {
      let a = new Team(team.id,
        team.name,
        team.leadUser,
        team.sizeTeam,
        team.players);
      this.listTeams[teamID] = a;
      console.log("succes load>" + JSON.stringify(this.listTeams));
      return new Promise<any>((resolve, reject) => {
        this.afs.collection('teams').doc(teamID.toString()).set({
          id: team.id,
          name: team.name,
          leadUser: team.leadUser,
          sizeTeam: team.sizeTeam,
          players: team.players
        })
          .then(
            res => resolve(res),
            err => reject(err)
          )
      })
    }
  }
