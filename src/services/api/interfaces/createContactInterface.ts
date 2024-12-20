export enum ContactRole {
    CLIENT='client',
    EMPLOYEE='employee'
}

export interface CreateContactDto {
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    role?: ContactRole | string;
    latitude?: string | null;
    longitude?: string | null;
  }
