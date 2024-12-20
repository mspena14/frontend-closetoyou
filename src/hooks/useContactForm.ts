import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { uploadImageToCloudinary, createContact, updateContact } from '../services/api/contactsService';
import { Contact } from '../interfaces/IContact';
import { Location } from '../interfaces/ILocation';
import { Alert } from 'react-native';

export const useContactForm = (
  setIsLoaded: (isLoaded: boolean) => void,
  onSaveFunction: () => void,
  existingContact?: Contact,
) => {
  const navigation = useNavigation();
  const [name, setName] = useState(existingContact?.name || '');
  const [phone, setPhone] = useState(existingContact?.phone || '');
  const [email, setEmail] = useState<string | undefined>(existingContact?.email || '');
  const [role, setRole] = useState<string>(existingContact?.role || 'client');
  const [location, setLocation] = useState<Location | null>(existingContact?.location || null);
  const [isSaving, setIsSaving] = useState(false);

  const saveContact = async (photoUri: string | null, selectedLocation: Location | null ) => {
    try {
      let emailToLoad = email;
      let photoUrl = existingContact?.photo || undefined;
      const validateUri = (uri: string) => {
        if (!uri.startsWith('file://')) {
          Alert.alert('Error', 'The URI is not valid or accessible.');
          return false;
        }
        return true;
      };
      if (photoUri && photoUri !== existingContact?.photo && validateUri(photoUri)) {
        photoUrl = await uploadImageToCloudinary(photoUri);
      }

      if (email === '' ) {
        emailToLoad = undefined;
      }
      const newContact = {
        name,
        phone,
        email: emailToLoad,
        role,
        photo: photoUrl,
        latitude: selectedLocation ? String(selectedLocation.latitude) : null,
        longitude: selectedLocation ? String(selectedLocation.longitude) : null,
      };

      if (existingContact) {
        await updateContact(existingContact.id, newContact);
        setIsLoaded(false);
      } else {
        await createContact(newContact);
      }

      await onSaveFunction();
      setIsLoaded(false);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving contact:', error.response || error.message);
    throw error;
  } finally {
    setIsSaving(false);
  }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    role,
    setRole,
    saveContact,
    location,
    setLocation,
    isSaving,
    setIsSaving,
  };
};
