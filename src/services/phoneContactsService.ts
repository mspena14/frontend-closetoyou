import Contacts from 'react-native-contacts';
import { usePermissions } from '../hooks/usePermissions';
import { Contact } from '../interfaces/IContact';

export const loadContactsFromPhone = async (): Promise<Contact[]> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { requestContactsPermission } = usePermissions();

  const hasPermission = await requestContactsPermission();
  if (!hasPermission) {
    throw new Error('Permission to access contacts denied');
  }

  try {
    const contactsList = await Contacts.getAll();

    return contactsList.map((contact) =>  ({
      id: contact.recordID,
      name: contact.displayName || '',
      email: contact.emailAddresses[0]?.email || '',
      phone: contact.phoneNumbers[0]?.number || '',
      photo: contact.thumbnailPath || '',
      role: 'client',
      location: null,
    }));
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};
