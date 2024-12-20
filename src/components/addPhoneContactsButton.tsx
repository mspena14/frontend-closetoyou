import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loadContactsFromPhone } from '../services/phoneContactsService';
import { Contact } from '../interfaces/IContact';


interface AddPhoneContactsButtonProps {
  syncPhoneContacts: (phoneContacts: Contact[]) => Promise<void>;
  isSyncing: boolean;
  hasSynced: boolean;
}

const AddPhoneContactsButton: React.FC<AddPhoneContactsButtonProps> = ({
  syncPhoneContacts,
  isSyncing,
  hasSynced,
}) => {
  const handleSync = async () => {
    try {
      const phoneContacts: any[] = await loadContactsFromPhone();
      if (phoneContacts.length === 0) {
        Alert.alert('Without contacts', 'No contacts were found on the phone.');
        return;
      }
      await syncPhoneContacts(phoneContacts);
    } catch (error) {
      Alert.alert('Error', 'There was a problem syncing contacts.');
      console.error(error);
    }
  };

  return (
    <MCIcon
      name={
        hasSynced
          ? 'check-circle'
          : isSyncing
          ? 'progress-clock'
          : 'phone-plus'
      }
      size={25}
      color={hasSynced ? 'green' : isSyncing ? 'gray' : 'white'}
      style={[styles.phoneIcon, (isSyncing || hasSynced) && styles.disabled]}
      onPress={
        hasSynced || isSyncing
          ? undefined
          : () => {
              Alert.alert(
                'Add phone contacts',
                'Do you want to add your phone contacts in this app?',
                [
                  {
                    text: 'Yes, let’s do it!',
                    onPress: handleSync,
                  },
                  { text: 'Cancel' },
                ]
              );
            }
      }
    />
  );
};

const styles = StyleSheet.create({
  phoneIcon: {
    padding: 10,
    borderRadius: 5,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AddPhoneContactsButton;
