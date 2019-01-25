import { User } from "./user";

export class Team {
    id: number;
    name: string;
    leadUser: User;
    sizeTeam: number;
    players: User[];

}
