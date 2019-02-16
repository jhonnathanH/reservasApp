import { User } from "./user";

export class Field {
  id?: number;
  fieldName: string;
  addres: string;
  town: string;
  city: string;
  phone: number;
  hours: string[];
  bufet?: string;
  sizeField: number;
  userCreate: User;
  countImages?: number;
  location?: {
    lat: number;
    lng: number;
  }
}
