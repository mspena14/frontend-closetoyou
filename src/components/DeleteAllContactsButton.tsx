import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DeleteAllContactsButtonProps {
  deleteAllContacts: () => void;
}

const DeleteAllContactsButton: React.FC<DeleteAllContactsButtonProps> = ({ deleteAllContacts }) => {
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
    <TouchableOpacity style={styles.button} onPress={handleDeleteAll}>
      <MCIcon name="delete-outline" size={25} color="white" />
      <Text style={styles.text}>Eliminar todos</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default DeleteAllContactsButton;
