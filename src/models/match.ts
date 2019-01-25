import { Team } from "./team";

export class match {
    id: number;
    day: string;
    month: string;
    year: string;
    hour?: string;
    field: number;
    team: Team;
    assis: number[];
}