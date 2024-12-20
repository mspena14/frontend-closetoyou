import React from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Contact } from '../interfaces/IContact';
import { loadContactsFromPhone } from '../services/phoneContactsService';

interface ActionButtonProps {
  syncPhoneContacts: (phoneContacts: Contact[]) => Promise<void>;
  deleteAllContacts: () => Promise<void>;
  isSyncing: boolean;
  hasSynced: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  syncPhoneContacts,
  deleteAllContacts,
  isSyncing,
  hasSynced,
}) => {
  const handleSync = async () => {
    try {
      const phoneContacts: Contact[] = await loadContactsFromPhone();
      if (phoneContacts.length === 0) {
        Alert.alert('No contacts', 'No contacts found on the phone.');
        return;
      }
      await syncPhoneContacts(phoneContacts);
    } catch (error) {
      Alert.alert('Error', 'There was a problem syncing contacts.');
      console.error(error);
    }
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete all contacts',
      'Are you sure you want to delete all contacts?',
      [
        { text: 'cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteAllContacts },
      ]
    );
  };

  return (
    <View style={styles.actionButtonContainer}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: hasSynced ? 'red' : 'blue' },
        ]}
        onPress={
          isSyncing
            ? undefined
            : hasSynced
            ? handleDeleteAll
            : () => {
                Alert.alert(
                  'Add phone contacts',
                  'Do you want to add your phone contacts in this app?',
                  [
                    {
                      text: "Yes, let's do it",
                      onPress: handleSync,
                    },
                    { text: 'Cancel' },
                  ]
                );
              }
        }
        disabled={isSyncing}
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <MCIcon
            name={hasSynced ? 'delete' : 'phone-plus'}
            size={25}
            color="white"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonContainer: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 60,
    height: 60,
  },
});

export default ActionButton;
