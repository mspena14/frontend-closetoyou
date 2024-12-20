import { Location } from './ILocation';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
  role: string;
  location: Location | null;
}
