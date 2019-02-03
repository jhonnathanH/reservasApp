import { Team } from "./team";

export class Match {
    id: number;
    name?: string;
    day: string;
    month: string;
    year: string;
    hour?: string;
    field: number;
    team?: Team;
    assis?: boolean;// validacion 
}