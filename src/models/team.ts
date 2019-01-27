import { User } from "./user";

export class Team {
    constructor(
        public id: number,
        public name: string,
        public leadUser: User,
        public sizeTeam: number,
        public players: User[]) {

    }

}
