import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from './../interfaces/IContact';
import { useAuth } from '../context/AuthContext';
import {
  fetchContacts,
  createManyContacts,
  deleteContactById,
  setAuthToken,
  deleteAllContacts,
} from '../services/api/contactsService';
import { transformContactToDto } from '../utils/contactTransform';

export const useContacts = () => {
  const { token, userLogged } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasSynced, setHasSynced] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [syncValidationTrigger, setSyncValidationTrigger] = useState<boolean>(false);
  const SYNC_KEY = userLogged || 'genericLogged';
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    const checkSyncStatus = async () => {
      const synced = await AsyncStorage.getItem(SYNC_KEY);
      setHasSynced(synced === 'true');
    };
    checkSyncStatus();
  }, [SYNC_KEY, syncValidationTrigger]);

  const loadContacts = useCallback(async () => {
    if (isLoaded) {return;}
    try {
      const data = await fetchContacts();
      setContacts(data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar los contactos desde el backend', error);
    }
  }, [isLoaded]);

 const syncPhoneContacts = useCallback(
  async (phoneContacts: Contact[]) => {
    if (isSyncing || hasSynced) {return;}
    setIsSyncing(true);

    try {
      const transformedContacts = await Promise.all(
        phoneContacts.map(async (contact) => {
           return transformContactToDto(contact);
        })
      );

      await createManyContacts(transformedContacts);
      setIsLoaded(false);
      await AsyncStorage.setItem(SYNC_KEY, 'true');
      setHasSynced(true);
      await loadContacts();
    } catch (error) {
      console.error('Error syncing phone contacts:', error);
    } finally {
      setIsSyncing(false);
    }
  },
  [isSyncing, hasSynced, SYNC_KEY, loadContacts]
);

const deleteAllUserContacts = useCallback(async () => {
  try {
    setIsDeleting(true);
    await deleteAllContacts();
    setContacts([]);
    setIsLoaded(true);
    await AsyncStorage.removeItem(SYNC_KEY);
    setSyncValidationTrigger((prev) => !prev);
  } catch (error) {
    console.error('Error deleting all contacts:', error);
  } finally {
    setIsDeleting(false);
  }
}, [SYNC_KEY]);

  const deleteContact = async (id: string) => {
    try {
      await deleteContactById(id);
      const updatedContacts = contacts.filter(
        (contact) => String(contact.id) !== String(id)
      );
      setContacts(updatedContacts);
      setIsLoaded(false);
    } catch (error) {
      console.error('Error deleting contact', error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return {
    contacts,
    loadContacts,
    deleteContact,
    setIsLoaded,
    syncPhoneContacts,
    isSyncing,
    hasSynced,
    deleteAllUserContacts,
    isDeleting,
  };
};
