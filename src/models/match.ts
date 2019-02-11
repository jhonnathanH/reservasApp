import { Team } from "./team";
import { Field } from "./field";

export class Match {
    id: number;
    name?: string;
    day: string;
    month: string;
    year: string;
    hour?: string;
    field: Field;
    team?: Team;
    assis?: boolean;// validacion 
}