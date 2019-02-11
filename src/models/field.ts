import { User } from "./user";

export class Field {
  id?: number;
  fieldName: string;
  addres: string;
  town: string;
  city: string;
  phone: number;
  //  hours: number;
  bufet?: string;
  sizeField: number;
  userCreate: User;
  location?: {
    lat: number;
    lng: number;
  }
}
