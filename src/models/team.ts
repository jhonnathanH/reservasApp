import { Match } from './match';
import { User } from "./user";

export class Team {
    
    nextMatch?: Match[];// validacion 
    constructor(
        public id: number,
        public name: string,
        public leadUser: User,
        public sizeTeam: number,
        public players: User[]) {

    }

}
