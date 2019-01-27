import { User } from '../../models/user';

export class PlayersServiceProvider {
  players: User[] = [];

  getPlayers() {
    return this.players.slice();
  }
  addPlayerstoTeam(player: User) {
    this.players.push(player);
  }
  removeAllPlayerstoTeam() {
    console.log('remove all players to team');
    return this.players = [];
  }
  removePlayerstoTeam(player: User) {
    const position = this.players.findIndex((playerNo: User) => {
      return playerNo.uid == player.uid;
    });
    this.players.splice(position, 1);
  }
}
