import { Contact } from '../interfaces/IContact';
import { ContactRole, CreateContactDto } from '../services/api/interfaces/createContactInterface';

export const transformContactToDto = (contact: Contact): CreateContactDto => ({
  name: contact.name,
  email: contact.email || undefined,
  phone: contact.phone,
  photo: contact.photo || undefined,
  role: contact.role as ContactRole,
  latitude: contact.location ? String(contact.location.latitude) : undefined,
  longitude: contact.location ? String(contact.location.longitude) : undefined,
});
