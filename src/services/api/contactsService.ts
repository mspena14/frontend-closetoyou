import api from './api';
import { Contact } from '../../interfaces/IContact';
import { CreateContactDto } from './interfaces/createContactInterface';
import { FetchContacts } from './interfaces/fetchContactsInterface';

export const fetchContactById = async (id: string): Promise<Contact> => {
  const response = await api.get<FetchContacts>(`/contacts/${id}`);
  const formatedContact: Contact = {
    id: response.data.id,
    name: response.data.name,
    phone: response.data.phone,
    email: response.data.email,
    photo: response.data.photo,
    role: response.data.role,
    location: response.data.latitude && response.data.longitude
     ? {
        latitude: parseFloat(response.data.latitude),
        longitude: parseFloat(response.data.longitude),
      }
      : null,
  };
  return formatedContact;
};


export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await api.get<FetchContacts[]>('/contacts');
  const formatedContacts: Contact[] = response.data.map(contact =>
  {
    let contactLocation;
    if (contact.latitude && contact.longitude) {
    contactLocation = {
      latitude: parseFloat(contact.latitude),
      longitude: parseFloat(contact.longitude),
    };
  }
    return ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    photo: contact.photo,
    role: contact.role,
    location: contactLocation || null,
  });});
  return formatedContacts;
};
export const uploadImageToCloudinary = async (photoUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    const file = {
      uri: photoUri,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    };
    formData.append('file', file);

    const response = await api.post('/cloudinary/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error.response || error.message);
    throw error;
  }
};

export const createManyContacts = async (contacts: CreateContactDto[]): Promise<void> => {
  await api.post('/contacts/createMany', contacts);
};

export const createContact = async (contact: CreateContactDto): Promise<CreateContactDto> => {
  const response = await api.post<CreateContactDto>('/contacts', contact);
  return response.data;
};

export const updateContact = async (id: string, contact: Partial<CreateContactDto>): Promise<CreateContactDto> => {
 try {
  const response = await api.patch<CreateContactDto>(`/contacts/${id}`, contact);
  return response.data;
 } catch (error: any) {
  console.error('Error updating contact:', error.response || error.message);
    throw error;
 }
};

export const deleteContactById = async (contactId: string): Promise<void> => {
  try {
    await api.delete(`/contacts/${contactId}`);
    console.log(`Contact ${contactId} successfully deleted`);
  } catch (error) {
    console.error(`Error deleting contact ${contactId}:`, error);
    throw error;
  }
};

export const deleteAllContacts = async (): Promise<void> => {
  await api.delete('/contacts');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};
