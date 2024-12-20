import { ContactRole } from './createContactInterface';

export interface FetchContacts {
    id: string;
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    role: ContactRole;
    latitude?: string;
    longitude?: string;
  }
