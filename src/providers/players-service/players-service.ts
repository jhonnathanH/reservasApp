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
    this.players = [];
  }
  removePlayerstoTeam(index: number) {
    this.players.splice(index, 1);
  }
}
